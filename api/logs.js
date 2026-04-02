import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
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

    const { rows } = await pool.query(
      'SELECT * FROM logs ORDER BY created_at DESC LIMIT 50'
    );

    const tableRows = rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.a}</td>
        <td>${r.b}</td>
        <td>${r.result}</td>
        <td>${new Date(r.created_at).toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})}</td>
      </tr>
    `).join('');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>계산 로그</title>
        <style>
          body { font-family: sans-serif; max-width: 700px; margin: 60px auto; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
          th { background: #f0f0f0; }
          tr:hover { background: #fafafa; }
        </style>
      </head>
      <body>
        <h2>📋 계산 로그</h2>
        <table>
          <thead>
            <tr><th>#</th><th>숫자 A</th><th>숫자 B</th><th>결과</th><th>시간 (KST)</th></tr>
          </thead>
          <tbody>
            ${tableRows.length ? tableRows : '<tr><td colspan="5">로그 없음</td></tr>'}
          </tbody>
        </table>
        <br>
        <a href="/">← 계산기로 돌아가기</a>
      </body>
      </html>
    `);
  } catch (e) {
    res.status(500).send('DB 오류: ' + e.message);
  }
}
