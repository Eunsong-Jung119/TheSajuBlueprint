export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  try {
    const { messages, max_tokens, temperature } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: max_tokens || 8000,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        messages,
        // JSON 강제 → 파싱 실패/잘림 감소 + 군더더기 출력 제거
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('[analyze] OpenAI error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }
    return res.status(200).json(data);
  } catch (e) {
    console.error('[analyze] handler error:', e);
    return res.status(500).json({ error: e.message });
  }
}