import { ALL_CARDS } from '../constants';
import { TarotCard, AnalysisResult } from '../types';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * Single-step analysis using Groq for text/logic and Pollinations for images.
 */
export const analyzeSituation = async (userInput: string): Promise<AnalysisResult> => {
  // Use API_KEY from environment (Standard Vercel/System env var)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("System configuration error: API Key missing");
  }

  const systemPrompt = `Ты — глубинный психолог и эксперт по Таро (юнгианский анализ). Твоя цель — дать инсайт. Верни ответ СТРОГО в формате JSON: { "card_id": 0-79, "card_name": "Название (RU)", "interpretation": "Текст (RU)", "image_prompt": "Описание сюрреалистичной картины (EN)" }`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    // Clean up potential markdown formatting from LLM response
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let resultJson;
    try {
      resultJson = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse JSON from Groq:", content);
      throw new Error("Invalid response format from AI");
    }

    // Map result to local card database
    // Priority: card_name -> card_id -> fallback
    let card: TarotCard | undefined = ALL_CARDS.find(
      c => c.name.toLowerCase() === resultJson.card_name?.toLowerCase()
    );

    if (!card && typeof resultJson.card_id === 'number') {
      card = ALL_CARDS[resultJson.card_id];
    }

    if (!card) {
      console.warn("Card not found, using default");
      card = ALL_CARDS[0];
    }

    // Generate Pollinations Image URL
    const imagePrompt = resultJson.image_prompt || `${card.name} tarot card, mystical`;
    // Clean prompt for URL
    const safePrompt = encodeURIComponent(imagePrompt);
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?model=turbo&width=768&height=1024&nologo=true`;

    return {
      card,
      interpretation: resultJson.interpretation || "Толкование не получено.",
      generatedImageUrl
    };

  } catch (error) {
    console.error("Analysis Service Error:", error);
    throw error;
  }
};