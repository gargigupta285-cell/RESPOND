export default function handler(req: any, res: any) {
  res.status(500).json({
    success: false,
    error: 'Database not available in serverless environment'
  });
}