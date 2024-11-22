const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../utils/validation');
const { body } = require('express-validator');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
    body('password')
        .isLength({ min: 8 }).withMessage('Das Passwort muss mindestens 8 Zeichen lang sein')
        .matches(/[A-Z]/).withMessage('Das Passwort muss mindestens einen Großbuchstaben enthalten')
        .matches(/[a-z]/).withMessage('Das Passwort muss mindestens einen Kleinbuchstaben enthalten')
        .matches(/[0-9]/).withMessage('Das Passwort muss mindestens eine Zahl enthalten')
        .matches(/[!@#$%^&*]/).withMessage('Das Passwort muss mindestens ein Sonderzeichen enthalten'),
    body('firstName').trim().notEmpty().withMessage('Vorname ist erforderlich'),
    body('lastName').trim().notEmpty().withMessage('Nachname ist erforderlich'),
    body('companyName').trim().optional()
];

const loginValidation = [
    body('email').isEmail().withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
    body('password').notEmpty().withMessage('Bitte geben Sie ein Passwort ein')
];

const emailValidation = [
    body('email').isEmail().withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein')
];

const resetPasswordValidation = [
    body('token').notEmpty().withMessage('Token ist erforderlich'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Das Passwort muss mindestens 8 Zeichen lang sein')
        .matches(/[A-Z]/).withMessage('Das Passwort muss mindestens einen Großbuchstaben enthalten')
        .matches(/[a-z]/).withMessage('Das Passwort muss mindestens einen Kleinbuchstaben enthalten')
        .matches(/[0-9]/).withMessage('Das Passwort muss mindestens eine Zahl enthalten')
        .matches(/[!@#$%^&*]/).withMessage('Das Passwort muss mindestens ein Sonderzeichen enthalten')
];

const updateProfileValidation = [
    body('firstName').trim().notEmpty().withMessage('Vorname ist erforderlich'),
    body('lastName').trim().notEmpty().withMessage('Nachname ist erforderlich'),
    body('companyName').trim().optional()
];

const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Aktuelles Passwort ist erforderlich'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Das Passwort muss mindestens 8 Zeichen lang sein')
        .matches(/[A-Z]/).withMessage('Das Passwort muss mindestens einen Großbuchstaben enthalten')
        .matches(/[a-z]/).withMessage('Das Passwort muss mindestens einen Kleinbuchstaben enthalten')
        .matches(/[0-9]/).withMessage('Das Passwort muss mindestens eine Zahl enthalten')
        .matches(/[!@#$%^&*]/).withMessage('Das Passwort muss mindestens ein Sonderzeichen enthalten')
];

// Public routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/forgot-password', emailValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', emailValidation, validateRequest, authController.resendVerification);

// Protected routes (require authentication)
router.put('/profile', authenticateJWT, updateProfileValidation, validateRequest, authController.updateProfile);
router.put('/change-password', authenticateJWT, changePasswordValidation, validateRequest, authController.changePassword);

module.exports = router;
