const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: "no-reply@armann-systems.com",
    pass: "Armann2019!?"
  }
});

const register = async (req, res) => {
  let connection;
  try {
    const { email, password, firstName, lastName, companyName } = req.body;

    // Check if user already exists
    const existingUsers = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Diese E-Mail-Adresse ist bereits registriert' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    connection = await db.beginTransaction();

    // Create user
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role, email_verified) VALUES (?, ?, ?, ?)',
      [email, passwordHash, 'customer', false]
    );

    // Create customer profile
    await connection.execute(
      'INSERT INTO customer_profiles (user_id, first_name, last_name, company_name) VALUES (?, ?, ?, ?)',
      [userResult.insertId, firstName, lastName, companyName]
    );

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 3600000); // 24 hours

    // Save verification token
    await connection.execute(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userResult.insertId, token, expiresAt]
    );

    // Commit transaction
    await db.commit(connection);

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'E-Mail-Adresse bestätigen',
      html: `
        <h1>Willkommen!</h1>
        <p>Bitte bestätigen Sie Ihre E-Mail-Adresse durch Klicken auf den folgenden Link:</p>
        <p><a href="${verifyUrl}">E-Mail-Adresse bestätigen</a></p>
        <p>Der Link ist 24 Stunden gültig.</p>
        <p>Falls Sie sich nicht registriert haben, ignorieren Sie bitte diese E-Mail.</p>
      `
    });

    res.status(201).json({ 
      message: 'Registrierung erfolgreich. Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.'
    });
  } catch (error) {
    if (connection) {
      await db.rollback(connection);
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
};

const verifyEmail = async (req, res) => {
  let connection;
  try {
    const { token } = req.params;

    // Get valid token
    const tokens = await db.query(
      'SELECT t.user_id, cp.id as customer_profile_id FROM email_verification_tokens t ' +
      'JOIN customer_profiles cp ON cp.user_id = t.user_id ' +
      'WHERE t.token = ? AND t.expires_at > NOW() AND t.used = FALSE',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'Ungültiger oder abgelaufener Bestätigungslink' });
    }

    const userId = tokens[0].user_id;
    const customerProfileId = tokens[0].customer_profile_id;

    // Start transaction
    connection = await db.beginTransaction();

    // Update user and mark token as used
    await connection.execute('UPDATE users SET email_verified = TRUE WHERE id = ?', [userId]);
    await connection.execute('UPDATE email_verification_tokens SET used = TRUE WHERE token = ?', [token]);

    // Check if customer already has an active subscription
    const existingSubscription = await connection.execute(
      'SELECT id FROM customer_subscriptions WHERE customer_id = ? AND is_active = TRUE',
      [customerProfileId]
    );

    // If no active subscription exists, create one with plan_id 1 (Free tier)
    if (existingSubscription.length === 0) {
      await connection.execute(
        'INSERT INTO customer_subscriptions (customer_id, plan_id, starts_at, is_active) VALUES (?, 1, NOW(), TRUE)',
        [customerProfileId]
      );
    }

    // Commit transaction
    await db.commit(connection);

    res.json({ message: 'E-Mail-Adresse erfolgreich bestätigt' });
  } catch (error) {
    if (connection) {
      await db.rollback(connection);
    }
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'E-Mail-Bestätigung fehlgeschlagen' });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Get unverified user
    const users = await db.query(
      'SELECT id FROM users WHERE email = ? AND email_verified = FALSE',
      [email]
    );

    if (users.length === 0) {
      return res.json({ message: 'Falls Ihre E-Mail-Adresse noch nicht bestätigt ist, erhalten Sie einen neuen Bestätigungslink.' });
    }

    const userId = users[0].id;

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 3600000); // 24 hours

    // Save new verification token
    await db.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'E-Mail-Adresse bestätigen',
      html: `
        <h1>E-Mail-Bestätigung</h1>
        <p>Bitte bestätigen Sie Ihre E-Mail-Adresse durch Klicken auf den folgenden Link:</p>
        <p><a href="${verifyUrl}">E-Mail-Adresse bestätigen</a></p>
        <p>Der Link ist 24 Stunden gültig.</p>
        <p>Falls Sie diese Bestätigung nicht angefordert haben, ignorieren Sie bitte diese E-Mail.</p>
      `
    });

    res.json({ message: 'Falls Ihre E-Mail-Adresse noch nicht bestätigt ist, erhalten Sie einen neuen Bestätigungslink.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Fehler beim Senden des Bestätigungslinks' });
  }
};

const login = async (req, res) => {
  const logger = req.logger || console;
  const requestId = req.id || Math.random().toString(36).substring(7);

  try {
    const { email, password } = req.body;

    logger.info({
      requestId,
      message: 'Login attempt initiated',
      email: email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Get user
    const users = await db.query(
      'SELECT u.*, cp.first_name, cp.last_name FROM users u LEFT JOIN customer_profiles cp ON u.id = cp.user_id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      logger.warn({
        requestId,
        message: 'Login failed - user not found',
        email: email,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      logger.warn({
        requestId,
        message: 'Login failed - invalid password',
        userId: user.id,
        email: email,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    if (!user.is_active) {
      logger.warn({
        requestId,
        message: 'Login failed - account inactive',
        userId: user.id,
        email: email,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Konto ist deaktiviert' });
    }

    // Update last login
    try {
      await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      
      logger.debug({
        requestId,
        message: 'Last login timestamp updated',
        userId: user.id
      });
    } catch (updateError) {
      logger.error({
        requestId,
        message: 'Failed to update last login timestamp',
        userId: user.id,
        error: updateError.message
      });
      // Continue with login process despite timestamp update failure
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info({
      requestId,
      message: 'Login successful',
      userId: user.id,
      email: email,
      role: user.role,
      ip: req.ip
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified
      }
    });
  } catch (error) {
    logger.error({
      requestId,
      message: 'Login error - unexpected failure',
      email: email,
      error: error.message,
      stack: error.stack,
      ip: req.ip
    });
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Get user
    const users = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.json({ message: 'Falls ein Konto existiert, erhalten Sie einen Link zum Zurücksetzen des Passworts.' });
    }

    const user = users[0];

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save token
    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Passwort zurücksetzen',
      html: `
        <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
        <p>Klicken Sie <a href="${resetUrl}">hier</a>, um Ihr Passwort zurückzusetzen.</p>
        <p>Der Link ist eine Stunde gültig.</p>
        <p>Falls Sie dies nicht angefordert haben, ignorieren Sie bitte diese E-Mail.</p>
      `
    });

    res.json({ message: 'Falls ein Konto existiert, erhalten Sie einen Link zum Zurücksetzen des Passworts.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Fehler beim Verarbeiten der Anfrage' });
  }
};

const resetPassword = async (req, res) => {
  let connection;
  try {
    const { token, newPassword } = req.body;

    // Get valid token
    const tokens = await db.query(
      'SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW() AND used = FALSE',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'Ungültiger oder abgelaufener Link' });
    }

    const userId = tokens[0].user_id;

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Start transaction
    connection = await db.beginTransaction();

    // Update password and mark token as used
    await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
    await connection.execute('UPDATE password_reset_tokens SET used = TRUE WHERE token = ?', [token]);

    // Commit transaction
    await db.commit(connection);

    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    if (connection) {
      await db.rollback(connection);
    }
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Fehler beim Zurücksetzen des Passworts' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const { firstName = null, lastName = null, companyName = null } = req.body;

    await db.query(
      'UPDATE customer_profiles SET first_name = ?, last_name = ?, company_name = ? WHERE user_id = ?',
      [firstName, lastName, companyName, userId]
    );

    res.json({ 
      message: 'Profil erfolgreich aktualisiert',
      user: {
        ...req.user,
        firstName,
        lastName,
        companyName
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const users = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Aktuelles Passwort ist falsch' });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);

    res.json({ message: 'Passwort erfolgreich geändert' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Fehler beim Ändern des Passworts' });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
};
