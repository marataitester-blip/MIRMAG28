
export const config = {
  runtime: 'edge',
};

// FULL DECK IMAGE DATABASE
const DECK_IMAGES = [
  // --- Major Arcana (0-21) ---
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
  // --- Special Cards ---
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/22_hero.png",       // 22 Hero
  "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/23_white_card.png", // 23 White Card

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

// Helper to call Groq
async function callGroq(messages, jsonMode = true) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: jsonMode ? { type: "json_object" } : undefined
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  let content = data.choices[0]?.message?.content || "{}";
  
  // Clean potential markdown wrappers
  if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(content);
}

// TASK A: Psychologist (Selects Card & Interprets)
async function getPsychologicalAnalysis(userRequest) {
  const systemPrompt = `Ты действуешь как синтетический психолог. В твоём стиле сочетаются:
  Карл Юнг (архетипы), Ричард Бах (метафоры полета), Стивен Волински (квантовая психология), 
  Берт Хеллингер (родовые системы), Дейл Карнеги (эмпатия), Банцхоф (тарология), 
  Владимир Леви (жизненная навигация) и Владимир Серкин (шаманские практики).

  Твоя задача:
  1. Проанализировать описание ситуации пользователя через призму архетипов и глубинной психологии.
  2. Выбрать ОДНУ карту из полной колоды (80 карт).
  
  Структура колоды (СТРОГО СОБЛЮДАЙ ID):
  - 0-21: Старшие Арканы (Судьбоносные, кармические уроки)
  - 22: Герой (Путь эго, опыт, испытание)
  - 23: Белая карта (Неизвестность, свобода воли, божественное вмешательство)
  - 24-37: Жезлы (Огонь: воля, страсть, карьера)
  - 38-51: Кубки (Вода: чувства, отношения, подсознание)
  - 52-65: Мечи (Воздух: мысли, конфликты, решения)
  - 66-79: Пентакли (Земля: деньги, тело, стабильность)

  3. Верни строго валидный JSON объект:
  {
    "card_id": <целое число от 0 до 79>,
    "card_name": "<название карты на русском>",
    "interpretation": "<философско-психологический анализ и совет. Стиль: мотивирующий, глубокий, вдохновляющий. Объем: 120-160 слов.>"
  }
  
  Никакого лишнего текста, только JSON.`;

  return callGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userRequest }
  ]);
}

// TASK B: Artist (Generates Image Prompt)
async function getVisualPrompt(userRequest) {
  const systemPrompt = `You are a surrealist artist creating prompts for generative AI (Pollinations).
  Create a visual description of the user's emotional state in the style of "Astral Tarot".
  Focus on symbolism, lighting, and mood. 
  Do NOT mention specific Tarot card names, focus on the visual essence and feelings.
  
  Return JSON:
  {
    "image_prompt": "A surreal painting of... (English, 30-50 words)"
  }`;

  return callGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userRequest }
  ]);
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { userRequest } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      throw new Error('Server configuration error: GROQ_API_KEY is missing');
    }

    const requestText = userRequest || "Общее состояние";

    // --- PARALLEL EXECUTION START ---
    // Launch both AI agents simultaneously
    const [psychData, visualData] = await Promise.all([
      getPsychologicalAnalysis(requestText),
      getVisualPrompt(requestText)
    ]);
    // --- PARALLEL EXECUTION END ---

    // 1. Process Card Image (Static)
    const cardId = psychData.card_id;
    let deckImageUrl = DECK_IMAGES[0]; // Default
    if (typeof cardId === 'number' && cardId >= 0 && cardId < DECK_IMAGES.length) {
        deckImageUrl = DECK_IMAGES[cardId];
    }

    // 2. Process Generated Image (Dynamic)
    // Turbo model for speed, optimal dimensions for mobile
    const promptEncoded = encodeURIComponent(visualData.image_prompt);
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?model=turbo&width=768&height=1024&nologo=true`;

    return new Response(JSON.stringify({
      card: {
        name: psychData.card_name,
        keyword: psychData.keyword || "Архетип",
        imageUrl: deckImageUrl
      },
      interpretation: psychData.interpretation,
      generatedImageUrl: generatedImageUrl,
      // Extra fields for robustness / logging / debugging
      timestamp: new Date().toISOString(),
      image_prompt: visualData.image_prompt,
      imageUrl: generatedImageUrl // Alias to match common APIs
    }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Processing failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
