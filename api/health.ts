export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}