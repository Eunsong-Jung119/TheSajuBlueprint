// api/analyze-en.js
let buildPromptMessagesEN;
try {
  ({ buildPromptMessagesEN } = require('../lib/prompt-engine-en'));
} catch (e) {
  console.error('[analyze-en] require error:', e.message);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // lib 로드 실패 여부 먼저 체크
  if (!buildPromptMessagesEN) {
    return res.status(500).json({ error: 'prompt-engine load failed — check lib/prompt-engine-en.js path' });
  }

  try {
    const { myInfo, partners } = req.body;

    if (!myInfo || !partners || !partners.length) {
      return res.status(400).json({ error: 'Missing myInfo or partners' });
    }

    // OpenAI 키 체크
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not set' });
    }

    // 메시지 빌드
    let messages;
    try {
      messages = buildPromptMessagesEN(myInfo, partners);
    } catch (buildErr) {
      console.error('[analyze-en] buildPromptMessages error:', buildErr);
      return res.status(500).json({ error: 'prompt build failed: ' + buildErr.message });
    }

    // GPT 호출
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4000,
        temperature: 0.7,
        messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!gptRes.ok) {
      const errText = await gptRes.text();
      console.error('[analyze-en] GPT error:', gptRes.status, errText);
      return res.status(500).json({ error: `GPT ${gptRes.status}: ${errText.substring(0, 200)}` });
    }

    const gptJson = await gptRes.json();
    const raw = gptJson.choices?.[0]?.message?.content || '';

    let result;
    try {
      result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (parseErr) {
      console.error('[analyze-en] JSON parse error:', raw.substring(0, 300));
      return res.status(500).json({ error: 'JSON parse failed', raw: raw.substring(0, 300) });
    }

    return res.status(200).json(result);

  } catch (e) {
    console.error('[analyze-en] Unexpected error:', e);
    return res.status(500).json({ error: e.message || 'Internal server error' });
  }
};