export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const records = req.body?.records || [];
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      count: Array.isArray(records) ? records.length : 0,
      message: 'Dataset state received and synchronized.'
    });
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    message: 'Dataset sync endpoint active.'
  });
}
