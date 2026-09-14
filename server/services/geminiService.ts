import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('[GEMINI] Failed to initialize GoogleGenAI client:', err);
    }
  }
  return genAIClient;
}

export class GeminiService {
  /**
   * Generates AI assistance for candidate queries, syllabus, or board rules
   */
  public async handleCandidateQuery(prompt: string, context?: string): Promise<{
    success: boolean;
    reply: string;
    source: 'gemini' | 'knowledge-base';
  }> {
    const ai = getGenAI();

    if (ai) {
      try {
        const systemInstruction = `
You are the Official AI Academic Assistant for Bihar State Educational Development & Research Council (BSEDRC / BRSV & RCT - बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद).
Office Address: Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar 852113.
Helpline: +91 7070530080, Email: adarshbiharsiksha@gmail.com.
You help students, teachers, and guardians with:
- Board examination schedules, syllabus, admit cards, and registration numbers.
- Results verification, re-evaluation, passing criteria (minimum 33% per subject, 300+ marks for 1st Division).
- Digital certificates, migration certificates, and online fee payments.
Respond politely in clear, formal Hindi and English (Bilingual or language chosen by user). Be concise, helpful, and official.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${context ? `Context: ${context}\n\n` : ''}User Query: ${prompt}`,
          config: {
            systemInstruction
          }
        });

        const reply = response.text || '';
        if (reply) {
          return {
            success: true,
            reply,
            source: 'gemini'
          };
        }
      } catch (err: any) {
        console.warn('[GEMINI] generateContent error:', err.message);
      }
    }

    // Official Knowledge Base fallback when Gemini API key is not present or rate limited
    return {
      success: true,
      reply: `नमस्ते! बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (BSEDRC) के आधिकारिक सहायता केंद्र में आपका स्वागत है।
- परीक्षा संबंधी किसी भी जानकारी, प्रवेश पत्र या अंकपत्र सत्यापन के लिए पोर्टल के मेनू से संबंधित विकल्प चुनें।
- आधिकारिक हेल्पलाइन: +91 7070530080
- ईमेल: adarshbiharsiksha@gmail.com
- कार्यालय: नेहा भवन, बीएनएमवी कॉलेज के पास, साहुगढ़, मधेपुरा, बिहार - 852113.`,
      source: 'knowledge-base'
    };
  }
}

export const geminiService = new GeminiService();
