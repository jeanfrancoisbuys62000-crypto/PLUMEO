
import { GoogleGenAI, Type } from "@google/genai";
import { Consigne, GradeLevel, AnalysisResult } from "../types";

// Fonction pour obtenir l'instance de l'IA avec la clé la plus récente
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = (err: any) => {
  console.error("API Error:", err);
  if (err.message?.includes("429") || err.status === 429) {
    throw new Error("LaboStyle est très sollicité. Patiente 10 secondes et réessaie !");
  }
  if (err.message?.includes("Requested entity was not found")) {
    // Cas spécifique où la clé API est invalide ou expirée dans l'environnement
    if (window.aistudio) {
       window.aistudio.openSelectKey();
    }
    throw new Error("Ta clé d'accès a expiré. Merci de cliquer à nouveau sur 'Activer mon accès'.");
  }
  throw err;
};

export const generateConsigne = async (grade: GradeLevel, theme: string): Promise<Consigne> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère un sujet de rédaction scolaire pour un élève de ${grade} sur le thème "${theme}".
      Réponds au format JSON avec les champs: title, description, type (un de: narratif, argumentatif, descriptif, explicatif).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING },
          },
          required: ["title", "description", "type"],
        }
      }
    });

    const data = JSON.parse(response.text);
    return { ...data, gradeLevel: grade };
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getInspirationContent = async (theme: string): Promise<{ text: string, tips: string[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un grand auteur classique. Écris un court texte d'inspiration (environ 150 mots) de type "${theme}" pour un collégien. 
      Le texte doit être exemplaire, riche en vocabulaire et respectant parfaitement les codes du genre.
      Ajoute aussi 3 conseils courts pour réussir ce genre d'exercice.
      Réponds en JSON avec les champs: "text" et "tips" (tableau de chaînes).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["text", "tips"],
        }
      }
    });
    return JSON.parse(response.text);
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getLexicalInfo = async (word: string, type: 'definition' | 'synonymes'): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = type === 'definition' 
      ? `Donne une définition courte, précise et adaptée à un collégien pour le mot : "${word}".`
      : `Donne une liste riche de synonymes et d'expressions équivalentes pour le mot : "${word}".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          systemInstruction: "Tu es LaboStyle, un dictionnaire pédagogique pour collégiens. Tes réponses sont concises et claires."
      }
    });
    return response.text || "Désolé, je n'ai pas trouvé d'informations.";
  } catch (err) {
    throw handleApiError(err);
  }
};

export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Extrais le texte brut de cette rédaction manuscrite." }
        ]
      }
    });
    return response.text || "";
  } catch (err) {
    throw handleApiError(err);
  }
};

export const analyzeRedaction = async (text: string, consigne: Consigne | null): Promise<AnalysisResult> => {
  try {
    const ai = getAI();
    const systemInstruction = `
      Tu es LaboStyle, un coach pédagogique pour collégiens (DNB). 
      Analyse la rédaction et fournis des retours constructifs SANS donner la correction directe.
      Note sur 40.
      
      IMPORTANT pour "annotatedText": entoure CHAQUE erreur par :
      <error type="grammar|lexical" hint="indice" guidance="question">texte erroné</error>.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Utilisation de Pro pour l'analyse complexe
      contents: `Analyse cette rédaction. Sujet: ${consigne?.title || "Libre"}. Texte: "${text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: {
              type: Type.OBJECT,
              properties: {
                organization: { type: Type.STRING },
                vocabulary: { type: Type.STRING },
                grammar: { type: Type.STRING },
                style: { type: Type.STRING },
              },
              required: ["organization", "vocabulary", "grammar", "style"]
            },
            annotatedText: { type: Type.STRING }
          },
          required: ["summary", "score", "strengths", "improvements", "advice", "annotatedText"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (err) {
    throw handleApiError(err);
  }
};
