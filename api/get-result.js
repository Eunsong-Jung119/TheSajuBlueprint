// api/get-result.js
// 공유 링크용: GET /api/get-result?id=abc123
// success 폴링용: GET /api/get-result?session_id=paddle_txn_xxx
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id, session_id } = req.query;

  try {
    let query = supabase.from('reports').select('id, payload');

    if (id) {
      if (!/^[a-z0-9]{6}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid report ID' });
      }
      query = query.eq('id', id);
    } else if (session_id) {
      // paddle_ prefix 포함해서 그대로 조회
      // webhook.js에서 payment_id를 'paddle_${transactionId}' 로 저장함
      query = query.eq('payment_id', session_id);
    } else {
      return res.status(400).json({ error: 'Missing id or session_id' });
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ payload: data.payload, reportId: data.id, success: true });
  } catch (err) {
    console.error('get-result error:', err);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
};