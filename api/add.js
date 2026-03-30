import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = a + b;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        a FLOAT,
        b FLOAT,
        result FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(
      'INSERT INTO logs (a, b, result) VALUES ($1, $2, $3)',
      [a, b, result]
    );
  } catch (e) {
    console.error('DB 오류:', e.message);
  }

  res.status(200).json({ result });
}
