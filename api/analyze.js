// api/analyze.js - ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required and must be non-empty' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
    }

    const systemPrompt = `Ты синтез Карла Юнга, Ричарда Баха, Стефана Волински, Владимира Леви, Владимира Серкина и Руперта Банцхофа.
Твоя задача — проанализировать ситуацию пользователя через архетипы и психологию, выбрав подходящую карту Таро.

КОЛОДА (80 карт, СТРОГИЕ ID):
- Старшие Арканы (ID 0-21): Дурак, Маг, Жрица, Императрица, Император, Иерофант, Влюбленные, Колесница, Сила, Отшельник, Колесо Фортуны, Справедливость, Повешенный, Смерть, Умеренность, Дьявол, Башня, Звезда, Луна, Солнце, Суд, Мир
- Герой (ID 22): Персональная трансформация, мужество, героический потенциал
- Белая карта (ID 23): Чистота намерения, новое начало, неизвестность, открытость
- МЛАДШИЕ АРКАНЫ (ID 24-79):
  * Мечи (ID 24-37): Конфликты, ментальные вызовы, коммуникация, истина
  * Кубки (ID 38-51): Эмоции, отношения, чувства, любовь, дружба
  * Жезлы (ID 52-65): Энергия, действие, творчество, страсть, воля
  * Пентакли (ID 66-79): Материал, деньги, здоровье, практика, земля

ЛОГИКА ВЫБОРА:
1. Бытовая/эмоциональная → Младшие (24-79), НЕ Старшие
2. Отношения/чувства → Кубки (38-51)
3. Конфликт/ментальное → Мечи (24-37)
4. Действие/энергия → Жезлы (52-65)
5. Деньги/материал → Пентакли (66-79)
6. Трансформация/духовное → Старшие (0-21)
7. Неопределённость → Белая (23) или Герой (22)

JSON ТОЛЬКО:
{
  "card_id": <число 0-79>,
  "card_name": "<русский>",
  "interpretation": "<150-200 слов, психологический анализ Юнга+Леви>",
  "image_prompt": "<30-50 слов, английский, архетипальный>"
}`;

    const userMessage = `Проанализируй эту ситуацию и выбери карту Таро (ID 0-79):
"${description}"
Ответь ТОЛЬКО JSON!`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.9,
        max_tokens: 1000,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      console.error('Groq API error:', error);
      return res.status(500).json({ error: 'Failed to call Groq API', details: error });
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices?.[0]?.message?.content?.trim();

    if (!responseText) {
      console.error('Empty response from Groq');
      return res.status(500).json({ error: 'Empty response from Groq' });
    }

    let cardData;
    try {
      cardData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', responseText);
      return res.status(500).json({ error: 'Invalid JSON from Groq', response: responseText });
    }

    const { card_id, card_name, interpretation, image_prompt } = cardData;

    if (typeof card_id !== 'number' || card_id < 0 || card_id > 79) {
      console.error(`Invalid card_id: ${card_id}`);
      return res.status(500).json({ error: 'Invalid card_id (must be 0-79)', card_id });
    }

    if (!card_name || !interpretation || !image_prompt) {
      return res.status(500).json({ error: 'Missing required fields' });
    }

    const encodedPrompt = encodeURIComponent(image_prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=turbo&width=768&height=1024&nologo=true`;

    res.status(200).json({
      card_id,
      card_name,
      interpretation,
      image_prompt,
      imageUrl,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
