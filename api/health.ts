export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'online',
    platform: 'vercel',
    timestamp: new Date().toISOString(),
    service: 'Insurance Claim Prediction API',
    version: '1.0.0'
  });
}
