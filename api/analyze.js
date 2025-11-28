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
              "card_id": 0-77, (ID карты, если бы это был массив, но нам важно название)
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

    // 2. Generate Pollinations Image URL
    // We construct the URL here to keep the frontend dumb
    const promptEncoded = encodeURIComponent(parsedData.image_prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?model=turbo&width=768&height=1024&nologo=true&seed=${seed}`;

    // 3. Match with local deck (simplified logic: just return what AI gave, frontend can try to match if needed, or we just trust AI)
    // We will return a structure that matches the frontend's expected AnalysisResult
    
    // Attempt to map the generated card to our local known cards is hard on backend without the constants file.
    // So we will pass the data needed for the frontend to render a "Generated" card primarily.
    // The frontend logic currently expects: card (local), interpretation, generatedImageUrl.
    
    // We construct the response
    return new Response(JSON.stringify({
      card: {
        name: parsedData.card_name,
        keyword: parsedData.keyword || "Архетип",
        imageUrl: imageUrl // We use the generated image as the "card" image for the primary display
      },
      interpretation: parsedData.interpretation,
      generatedImageUrl: imageUrl // Redundant but safe
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