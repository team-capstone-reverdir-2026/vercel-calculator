export default function handler(req, res) {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  res.status(200).json({ result: a + b });
}
