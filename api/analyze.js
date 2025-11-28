export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { userRequest } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      throw new Error('Server configuration error: GROQ_API_KEY is missing');
    }

    // 1. Call Groq API (Llama 3.3)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Ты — глубинный психолог и эксперт по Таро (юнгианский анализ). Твоя цель — дать инсайт.
            Верни ответ СТРОГО в формате JSON без лишнего текста и markdown-тегов.
            Структура JSON:
            {
              "card_id": 0-77,
              "card_name": "Название карты (RU)",
              "keyword": "Ключевое слово",
              "interpretation": "Глубокое психологическое толкование состояния (RU, 3-4 предложения)",
              "image_prompt": "Описание сюрреалистичной картины в стиле Astral Tarot, отражающей суть карты (EN)"
            }`
          },
          {
            role: 'user',
            content: userRequest || "Общий анализ состояния"
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API Error:', errText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    let content = groqData.choices[0]?.message?.content;

    // Clean up content if it contains markdown code blocks
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      console.error('JSON Parse Error:', content);
      throw new Error('Failed to parse AI response');
    }

    // 2. Generate Pollinations Image URL (Optimized for Speed)
    // Using model=turbo and 768x1024 dimensions as requested
    const promptEncoded = encodeURIComponent(parsedData.image_prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?model=turbo&width=768&height=1024&nologo=true`;

    // 3. Return Response
    return new Response(JSON.stringify({
      card: {
        name: parsedData.card_name,
        keyword: parsedData.keyword || "Архетип",
        imageUrl: imageUrl
      },
      interpretation: parsedData.interpretation,
      generatedImageUrl: imageUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Handler Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}