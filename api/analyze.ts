// api/analyze.ts
export const config = {
  runtime: 'edge', // Максимальная скорость
};

export default async function handler(req: Request) {
  // Настройка заголовков (CORS)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { mode, userRequest } = await req.json();
    
    let apiUrl = "";
    let apiKey = "";
    let model = "";
    
    // ЛОГИКА ВЫБОРА КАНАЛА
    if (mode === 'groq') {
        // Канал 1: GROQ (VIP/Скорость)
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = process.env.GROQ_API_KEY;
        model = "llama-3.3-70b-versatile"; // Самая умная и быстрая
    } else {
        // Канал 2: OPENROUTER (Авто/Резерв)
        apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        apiKey = process.env.OPENROUTER_API_KEY;
        model = "google/gemini-2.0-flash-exp:free"; // Бесплатный Gemini
    }

    if (!apiKey) {
        throw new Error(`Ключ API для режима ${mode} не найден. Проверьте настройки Vercel.`);
    }

    // ЗАПРОС К ИИ (Нативный fetch)
    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mirmag.app",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "Ты — глубинный психолог и эксперт по Таро (юнгианский анализ). Твоя цель — дать инсайт. Верни ответ СТРОГО в формате JSON (без markdown): { \"card_name\": \"Название карты (RU)\", \"interpretation\": \"Текст толкования (RU, 3-4 предложения)\", \"image_prompt\": \"Описание сюрреалистичной картины (EN)\" }."
          },
          {
            role: "user",
            content: userRequest || "Общий прогноз"
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`Ошибка провайдера (${mode}): ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices[0].message.content;

    // Очистка от мусора (```json ...)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("ИИ вернул не JSON: " + content);
    
    const result = JSON.parse(jsonMatch[0]);

    // Генерация картинки (Pollinations - Бесплатно)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt + " tarot style, mystical, dark gold, 8k")}?model=flux&width=768&height=1024&nologo=true`;

    return new Response(JSON.stringify({
      card_name: result.card_name,
      interpretation: result.interpretation,
      imageUrl: imageUrl
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
