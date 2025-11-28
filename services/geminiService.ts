import { GoogleGenAI, Type } from "@google/genai";
import { ALL_CARDS } from '../constants';
import { TarotCard } from '../types';

// NOTE: We initialize the client inside functions to ensure process.env.API_KEY is available
// after the user selects it via window.aistudio.openSelectKey()

const MODEL_FAST = 'gemini-2.5-flash';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * 1. Analyze input and select the best card
 */
export const findBestMatchingCard = async (userInput: string): Promise<TarotCard> => {
  const ai = getAiClient();
  const cardList = ALL_CARDS.map(c => `"${c.name}" (${c.keyword})`).join(", ");
  
  const prompt = `
    You are a mystical Tarot master using the "Astral Hero" deck.
    
    The user has described this state/situation: 
    "${userInput}"

    From the following list of cards, select the ONE that best represents the archetypal energy of this situation.
    
    List: ${cardList}

    Return ONLY JSON with the exact name of the card.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cardName: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text || "{}";
  try {
    const json = JSON.parse(text);
    const selectedName = json.cardName;
    const found = ALL_CARDS.find(c => c.name.toLowerCase() === selectedName.toLowerCase());
    // Fallback to random if AI hallucinates a name (rare but possible)
    return found || ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
  } catch (e) {
    console.error("Error parsing card selection", e);
    return ALL_CARDS[0];
  }
};

/**
 * 2. Generate Psychological Interpretation
 */
export const generateInterpretation = async (userInput: string, card: TarotCard): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    You are a compassionate psychological counselor and Tarot expert.
    
    Context:
    User Input: "${userInput}"
    Selected Card: "${card.name}" (Archetype: ${card.keyword})

    Task:
    Provide a psychological "Portrait" of the user's situation based on this card.
    1. Acknowledge their state (Mirroring).
    2. Explain why this Archetype appeared (The psychological link).
    3. Give actionable advice or a question for reflection based on the card's energy.
    
    Tone: Mystical but grounded, supportive, deep.
    Language: Russian.
    Length: Around 150-200 words. Format with simple paragraphs.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
  });

  return response.text || "Не удалось получить толкование. Попробуйте еще раз.";
};

/**
 * 3. Generate Unique Image (Optimized via Pollinations.ai)
 */
export const generatePersonalizedImage = async (userInput: string, card: TarotCard): Promise<string | null> => {
  // Truncate user input to 100 chars and remove special chars to prevent URL issues
  const safeInput = userInput.slice(0, 100).replace(/[^\w\sа-яА-ЯёЁ\.,]/gi, '');
  
  // Construct a prompt that combines the Tarot Archetype with the user's psychological state
  const prompt = `Tarot card masterpiece, ${card.name}, ${card.keyword}, psychological state: ${safeInput}. Mystical, ethereal, cinematic lighting, gold and dark blue colors, highly detailed, 8k, digital painting`;
  
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 99999); // Random seed to force fresh generation
  
  // Use parameters for maximum speed (model=turbo, 768x1024)
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=turbo&width=768&height=1024&nologo=true&seed=${seed}`;

  // Return the URL directly. The browser will trigger the generation when it loads the image.
  return url;
};
