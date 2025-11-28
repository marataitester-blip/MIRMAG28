
export const config = {
  runtime: 'edge',
};

// FULL DECK IMAGE DATABASE
const DECK_IMAGES = [
  // --- Major Arcana (0-23) ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/00_fool.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/01_magician.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/02_high_priestess.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/03_empress.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/04_emperor.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/05_hierophant.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/06_lovers.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/07_chariot.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/08_justice.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/09_hermit.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/10_wheel_of_fortune.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/11_strength.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/12_hanged_man.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/13_death.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/14_temperance.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/15_devil.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/16_tower.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/17_star.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/18_moon.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/19_sun.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/20_judgement.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/21_world.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/22_hero.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/23_white_card.png",

  // --- Wands (24-37) ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_01_ace.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_02_two.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_03_three.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_04_four.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_05_five.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_06_six.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_07_seven.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_08_eight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_09_nine.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_10_ten.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_11_page.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_12_knight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_13_queen.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_14_king.png",

  // --- Cups (38-51) ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_01_ace.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_02_two.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_03_three.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_04_four.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_05_five.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_06_six.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_07_seven.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_08_eight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_09_nine.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_10_ten.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_11_page.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_12_knight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_13_queen.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_14_king.png",

  // --- Swords (52-65) ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_01_ace.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_02_two.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_03_three.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_04_four.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_05_five.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_06_six.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_07_seven.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_08_eight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_09_nine.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_10_ten.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_11_page.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_12_knight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_13_queen.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_14_king.png",

  // --- Pentacles (66-79) ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_01_ace.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_02_two.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_03_three.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_04_four.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_05_five.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_06_six.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_07_seven.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_08_eight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_09_nine.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_10_ten.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_11_page.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_12_knight.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_13_queen.png",
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_14_king.png"
];

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
            Верни ответ СТРОГО в формате JSON без лишнего текста.
            
            Выбери карту из 80 вариантов (0-23 Старшие Арканы, 24-79 Младшие).
            
            Структура JSON:
            {
              "card_id": 0-79,
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

    // 2. Select the Static Image from the Deck
    const cardId = parsedData.card_id;
    let deckImageUrl = "";
    
    // Safety check for index bounds
    if (typeof cardId === 'number' && cardId >= 0 && cardId < DECK_IMAGES.length) {
        deckImageUrl = DECK_IMAGES[cardId];
    } else {
        // Fallback to Fool if ID is invalid
        deckImageUrl = DECK_IMAGES[0];
    }

    // 3. Generate Unique Portrait URL (Pollinations)
    const promptEncoded = encodeURIComponent(parsedData.image_prompt);
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?model=turbo&width=768&height=1024&nologo=true`;

    // 4. Return Response
    return new Response(JSON.stringify({
      card: {
        name: parsedData.card_name,
        keyword: parsedData.keyword || "Архетип",
        imageUrl: deckImageUrl // <--- USE STATIC DECK IMAGE HERE
      },
      interpretation: parsedData.interpretation,
      generatedImageUrl: generatedImageUrl // <--- USE DYNAMIC IMAGE HERE
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
