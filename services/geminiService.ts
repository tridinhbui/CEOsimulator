import { GoogleGenAI, Type } from "@google/genai";
import { CompanyMetrics, Scenario, ScenarioCategory } from "../types";
import { SEED_SCENARIOS } from "../constants";

const apiKey = process.env.API_KEY;
let genAI: GoogleGenAI | null = null;

if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

export const generateScenario = async (
  metrics: CompanyMetrics, 
  turn: number
): Promise<Scenario> => {
  // 30% chance to force a specific seed scenario if risk is high or specific conditions met
  if (metrics.risk > 70 && Math.random() > 0.5) {
     const crisis = SEED_SCENARIOS.find(s => s.category === ScenarioCategory.CRISIS);
     if (crisis) return crisis;
  }
  
  if (metrics.cash < 500000000 && Math.random() > 0.5) {
      const finance = SEED_SCENARIOS.find(s => s.title === 'Lithium Mine Acquisition'); // Example fallback
      if (finance) return finance;
  }

  // Fallback to seed data if no API or 50% of the time to keep game predictable
  if (!genAI || !apiKey || Math.random() > 0.6) {
    const seedIndex = (turn + Math.floor(Math.random()*10)) % SEED_SCENARIOS.length;
    return SEED_SCENARIOS[seedIndex];
  }

  try {
    const systemInstruction = `
      You are a simulation engine for a "Fortune 500 CEO Simulator" game.
      Generate a realistic, high-stakes business scenario for a massive manufacturing conglomerate.
      Think about: Supply Chains, Unions, Global Geopolitics, Environmental Regulations, Robotics, and M&A.
      
      Current Metrics:
      - Cash: $${(metrics.cash/1000000).toFixed(0)} Million
      - Burn: $${(metrics.monthlyBurn/1000000).toFixed(0)} Million/mo
      - Revenue: $${(metrics.monthlyRevenue/1000000).toFixed(0)} Million/mo
      - Morale: ${metrics.morale}/100
      - Market Share: ${metrics.marketShare}/100
      - Risk: ${metrics.risk}/100

      Options must have clear tradeoffs. Impact values should be significant (in the millions of dollars).
      If Risk is high (>70), generate a negative event.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a new corporate business scenario.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(ScenarioCategory) },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  impact: {
                    type: Type.OBJECT,
                    properties: {
                      cash: { type: Type.NUMBER },
                      monthlyRevenue: { type: Type.NUMBER },
                      monthlyBurn: { type: Type.NUMBER },
                      morale: { type: Type.NUMBER },
                      customerSatisfaction: { type: Type.NUMBER },
                      marketShare: { type: Type.NUMBER },
                      risk: { type: Type.NUMBER },
                      valuation: { type: Type.NUMBER },
                    }
                  }
                },
                required: ["id", "text", "feedback", "impact"]
              }
            }
          },
          required: ["id", "title", "description", "category", "options"]
        }
      }
    });

    if (response.text) {
      const scenario = JSON.parse(response.text) as Scenario;
      return scenario;
    }
    
    throw new Error("No text in response");

  } catch (error) {
    console.error("Gemini generation failed, falling back to seed data", error);
    return SEED_SCENARIOS[Math.floor(Math.random() * SEED_SCENARIOS.length)];
  }
};

export const getAdvisorAdvice = async (scenario: Scenario, metrics: CompanyMetrics): Promise<string> => {
    if (!genAI || !apiKey) {
        return "The board recommends caution. Large ships turn slowly.";
    }

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user is playing a Fortune 500 CEO simulator. 
            Scenario: ${scenario.title} - ${scenario.description}
            Options: ${scenario.options.map(o => o.text).join(', ')}
            
            Company State: Cash $${(metrics.cash/1000000).toFixed(0)}M, Morale ${metrics.morale}, Risk ${metrics.risk}.
            
            Give a 1-sentence strategic hint on what to do. Act like a seasoned, slightly cynical corporate board member.`,
        });
        return response.text || "Protect the share price at all costs.";
    } catch (e) {
        return "The board is silent on this matter.";
    }
};