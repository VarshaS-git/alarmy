// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // PostgreSQL username
  host: 'localhost',              // Database host
  database: 'postgres',         // Database name
  password: 'varsha123',   // PostgreSQL password
  port: 5432,                     // Default PostgreSQL port
});

module.exports = pool;