
import { GoogleGenAI, Type } from "@google/genai";
import { Consigne, GradeLevel, AnalysisResult } from "../types";

// Fonction utilitaire pour gérer les erreurs d'API communes
const handleApiError = (err: any) => {
  console.error("API Error:", err);
  if (err.message?.includes("429") || err.status === 429) {
    throw new Error("Pluméo est très sollicité en ce moment (limite de requêtes atteinte). Patiente 10 petites secondes et réessaie !");
  }
  if (err.message?.includes("500") || err.status === 500) {
    throw new Error("Le cerveau de Pluméo fatigue un peu (erreur serveur). Réessaie dans un instant.");
  }
  throw err;
};

export const generateConsigne = async (grade: GradeLevel, theme: string): Promise<Consigne> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = type === 'definition' 
      ? `Donne une définition courte, précise et adaptée à un collégien pour le mot : "${word}". Si le mot a plusieurs sens importants, liste les deux principaux.`
      : `Donne une liste riche de synonymes et d'expressions équivalentes pour le mot : "${word}". Organise-les par nuance ou niveau de langue si possible.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          systemInstruction: "Tu es un dictionnaire pédagogique pour collégiens. Tes réponses sont concises, claires et utilisent un ton encourageant."
      }
    });
    return response.text || "Désolé, je n'ai pas trouvé d'informations pour ce mot.";
  } catch (err) {
    throw handleApiError(err);
  }
};

export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Tu es un expert en lecture de manuscrits scolaires. Extrais tout le texte présent dans cette image de rédaction. Renvoie UNIQUEMENT le texte brut extrait, sans aucun commentaire additionnel, sans titre ajouté, et sans mise en forme spéciale." }
        ]
      },
      config: {
        temperature: 0.1,
      }
    });
    return response.text || "";
  } catch (err) {
    throw handleApiError(err);
  }
};

export const analyzeRedaction = async (text: string, consigne: Consigne | null): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      Tu es un coach pédagogique bienveillant pour collégiens français (6ème à 3ème).
      Ton rôle est d'analyser une rédaction et de fournir des retours constructifs SANS donner la correction directe.
      
      Critères d'analyse:
      1. Respect du sujet et des consignes.
      2. Organisation (paragraphes, connecteurs).
      3. Qualité de la langue (grammaire, orthographe, syntaxe).
      4. Vocabulaire (richesse, précision).

      IMPORTANT: La note finale doit être sur 40, comme à l'épreuve de français du Diplôme National du Brevet (DNB).

      IMPORTANT: Pour le champ "annotatedText", renvoie le texte original complet mais entoure CHAQUE erreur identifiée par une balise spéciale:
      <error type="grammar|lexical" hint="indice court" guidance="question pour faire réfléchir">le texte erroné</error>.
      Ne corrige PAS le texte dans le retour "annotatedText", garde les erreurs telles quelles à l'intérieur des balises.
    `;

    const prompt = `
      Analyse cette rédaction d'un élève de ${consigne?.gradeLevel || "Collège"}.
      Sujet: ${consigne?.title || "Libre"}
      Description du sujet: ${consigne?.description || "Aucune"}
      
      Texte de l'élève:
      "${text}"

      Réponds en JSON structuré. Note sur 40.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
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
