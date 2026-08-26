import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Ks@kbd23777';
const DB_NAME = process.env.DB_NAME || 'vastrasetu_db';
const DB_PORT = process.env.DB_PORT || 3306;

// Create connection pool
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database schema and tables
export async function initializeDatabase() {
  try {
    // 1. Ensure database exists
    const tempConn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT,
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await tempConn.end();

    const conn = await pool.getConnection();
    console.log(`🐬 Connected to MySQL Database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}`);

    // 2. Table: msme_accounts
    await conn.query(`
      CREATE TABLE IF NOT EXISTS msme_accounts (
        id VARCHAR(50) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        gstin VARCHAR(15) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        sector VARCHAR(100) DEFAULT 'Textiles & Apparel',
        contact_name VARCHAR(150) NOT NULL,
        contact_email VARCHAR(150) UNIQUE NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        status ENUM('PENDING_VERIFICATION', 'VERIFICATION_IN_PROGRESS', 'VERIFICATION_FAILED', 'ACTIVE') DEFAULT 'PENDING_VERIFICATION',
        udyam_number VARCHAR(100),
        verified_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Table: identity_proofs
    await conn.query(`
      CREATE TABLE IF NOT EXISTS identity_proofs (
        id VARCHAR(50) PRIMARY KEY,
        msme_id VARCHAR(50) NOT NULL,
        doc_type ENUM('udyam_certificate', 'gst_certificate') NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        extracted_fields JSON,
        verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        rejection_reason TEXT,
        dpi_ref_id VARCHAR(100),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP NULL,
        FOREIGN KEY (msme_id) REFERENCES msme_accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Table: auth_sessions
    await conn.query(`
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id VARCHAR(50) PRIMARY KEY,
        msme_id VARCHAR(50) NOT NULL,
        refresh_token_hash VARCHAR(255) NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (msme_id) REFERENCES msme_accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Table: otp_requests
    await conn.query(`
      CREATE TABLE IF NOT EXISTS otp_requests (
        id VARCHAR(50) PRIMARY KEY,
        msme_id VARCHAR(50) NOT NULL,
        otp_hash VARCHAR(255) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        attempts INT DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (msme_id) REFERENCES msme_accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Table: audit_log
    await conn.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id VARCHAR(50) PRIMARY KEY,
        msme_id VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        ip_address VARCHAR(50),
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Table: production_batches
    await conn.query(`
      CREATE TABLE IF NOT EXISTS production_batches (
        id VARCHAR(50) PRIMARY KEY,
        order_ref VARCHAR(100),
        buyer_name VARCHAR(150),
        target_country VARCHAR(100),
        destination_port VARCHAR(100),
        garment_type VARCHAR(100),
        garment_title VARCHAR(255),
        style_code VARCHAR(100),
        gtin VARCHAR(50),
        hs_code VARCHAR(50),
        fabric_type VARCHAR(100),
        fabric_description TEXT,
        yarn_spinning_mill VARCHAR(255),
        weight_gsm INT,
        quantity INT,
        piece_weight_kg DECIMAL(8,3),
        freight_mode VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING_DYER',
        dyer_name VARCHAR(255),
        cetp_name VARCHAR(255),
        fiber_certificate JSON,
        dyeing_record JSON,
        cetp_record JSON,
        passport_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Seed Initial Default MSME if empty
    const [existingMsmes] = await conn.query(`SELECT COUNT(*) AS cnt FROM msme_accounts;`);
    if (existingMsmes[0].cnt === 0) {
      await conn.query(`
        INSERT INTO msme_accounts (id, business_name, gstin, address, sector, contact_name, contact_email, contact_phone, password_hash, status, udyam_number, verified_at)
        VALUES ('MSME-TPR-001', 'Sri Jayavarma Knits & Exports Pvt Ltd', '33AAACJ1928A1Z5', 'Avinashi Road, Tiruppur, Tamil Nadu (PIN 641603)', 'Textiles & Apparel', 'Ramesh Jayavarma', 'ramesh@jayavarmaknits.com', '+91 98422 10982', '$2a$10$wTzS740wL2R8vL0o3p.uYeZ3K9W8.3sP87eD1wG4sX5bH6jK7lM2e', 'ACTIVE', 'UDYAM-TN-28-0019284', NOW());
      `);

      await conn.query(`
        INSERT INTO audit_log (id, msme_id, action, ip_address, details)
        VALUES ('LOG-001', 'MSME-TPR-001', 'INITIAL_SEED', '127.0.0.1', 'Initial verified MSME account created in MySQL.');
      `);
      console.log('🌱 MySQL Seed Data Initialized Successfully.');
    }

    conn.release();
  } catch (err) {
    console.error('❌ MySQL Initialization Error:', err);
  }
}
