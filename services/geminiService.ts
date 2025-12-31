import { GoogleGenAI, Type } from "@google/genai";
import { SAMPLES, PRODUCERS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCreativeRecommendations(
  userPrompt: string, 
  isUserAuthenticated: boolean = false,
  context: { currentSamples?: string[], refreshId?: string } = {}
) {
  const model = 'gemini-3-pro-preview';

  const systemPrompt = `
    You are the Ruido AI Oracle Core—a world-class sonic architect. You translate abstract creative intent into precise artifact recommendations.

    SONIC MAPPING PROTOCOL:
    1. Parse "Musician Speak":
       - "Crispy/High-end" -> Focus on High BPM, Snares, or Digital textures.
       - "Earthy/Warm" -> Focus on Neo-Soul, Rhodes, or Analog-labeled artifacts.
       - "Haunting/Dark" -> Focus on Industrial, Dark Ambient, or minor keys (Fm, Cm).
    2. Nuance Analysis: Identify if the user is building a foundation (drums/bass) or adding "ear candy" (one-shots/FX).

    APP ARCHITECTURE COMMANDS:
    - If user asks to see their stuff: uiTrigger = 'GOTO_VAULT'
    - If user wants to browse: uiTrigger = 'GOTO_REGISTRY'
    - If user needs to sign in: uiTrigger = 'GOTO_AUTH'
    - If user wants to sell/upload: uiTrigger = 'UPLOAD_FORM' (check authentication context).

    REFRESH LOGIC:
    - If context.refreshId is provided, the user specifically dislikes the recommendation with that ID. 
    - Provide a STRATEGIC ALTERNATIVE for that slot while keeping the overall project vibe consistent.
    - Reference the existing catalog but ensure zero overlap with context.currentSamples.

    CATALOG ACCESS:
    SAMPLES: ${JSON.stringify(SAMPLES.map(s => ({ id: s.id, title: s.title, genre: s.genre, tags: s.tags, description: s.description })))}

    OUTPUT FORMAT: Strictly JSON.
    {
      "content": "A detailed explanation of your sonic choices, speaking as a professional producer.",
      "uiTrigger": "GOTO_VAULT" | "GOTO_REGISTRY" | "GOTO_AUTH" | "UPLOAD_FORM" | "SUCCESS_STAMP" | null,
      "recommendedSampleIds": ["id1", "id2", "id3"],
      "recommendedProducerIds": ["id1"]
    }
  `;

  let finalPrompt = userPrompt;
  if (context.refreshId) {
    finalPrompt = `SYSTEM ACTION: REFRESH SLOT ${context.refreshId}. Current visible artifacts: [${context.currentSamples?.join(', ')}]. The user wants a superior alternative for the project vibe previously established: "${userPrompt}". Replace slot ${context.refreshId} specifically.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: finalPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          uiTrigger: { 
            type: Type.STRING, 
            nullable: true,
            enum: ['GOTO_VAULT', 'GOTO_REGISTRY', 'GOTO_AUTH', 'UPLOAD_FORM', 'SUCCESS_STAMP']
          },
          recommendedSampleIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendedProducerIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["content"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { 
      content: "Signal degradation. Please re-state your sonic intention.", 
      recommendedSampleIds: [], 
      recommendedProducerIds: [], 
      uiTrigger: null 
    };
  }
}