const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dnsapi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function for queries
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

// Transaction support
async function beginTransaction() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
}

async function commit(connection) {
    try {
        await connection.commit();
    } finally {
        connection.release();
    }
}

async function rollback(connection) {
    try {
        await connection.rollback();
    } finally {
        connection.release();
    }
}

// Test database connection
async function testConnection() {
    try {
        await query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

module.exports = {
    query,
    testConnection,
    pool,
    beginTransaction,
    commit,
    rollback
};
