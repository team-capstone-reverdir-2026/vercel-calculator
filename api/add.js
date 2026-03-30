import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const result = a + b;

  // 테이블 없으면 자동 생성
  await sql`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      a FLOAT,
      b FLOAT,
      result FLOAT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // 로그 저장
  await sql`INSERT INTO logs (a, b, result) VALUES (${a}, ${b}, ${result})`;

  res.status(200).json({ result });
}
