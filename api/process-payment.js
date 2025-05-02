export default async function handler(req, res) {
  try {
    const { token } = req.body;

    console.log('🔐 Simulated payment token received:');
    console.log(JSON.stringify(token, null, 2));

    res.status(200).json({ status: 'ok', message: 'Simulated token processed' });
  } catch (err) {
    console.error('❌ Failed to handle token:', err);
    res.status(500).json({ error: 'Failed to handle token' });
  }
}
