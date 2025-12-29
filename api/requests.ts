export default function handler(req, res) {
  res.status(500).json({
    success: false,
    error: 'Database not available in serverless environment'
  });
}