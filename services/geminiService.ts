
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to sanitize JSON from Markdown code blocks or raw text
const cleanJson = (text: string) => {
  const codeBlockMatch = text.match(/```json([\s\S]*?)```/);
  if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
      return text.substring(firstBrace, lastBrace + 1);
  }
  return text.trim();
};

/**
 * Acts as a Universal API Bridge using Gemini 3 Flash Preview.
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview"; 

  const prompt = `
    You are a high-performance e-commerce API aggregator. 
    User Query: "${query}"
    
    ACTION: Perform a live Google Search for "${query} buy online price india" to find current product listings AND images.
    
    DATA EXTRACTION RULES:
    1.  Identify EXACTLY 10-12 DISTINCT and RELEVANT product models matching "${query}".
    2.  For EACH product, find the single BEST available price/offer.
    3.  EXTRACT the specific current price in INR.
    4.  EXTRACT the direct product URL.
    5.  EXTRACT the ACTUAL Product Image URL. 
    6.  GENERATE a concise list of key features (max 2 items).
    
    OUTPUT FORMAT: Strictly VALID JSON.
    {
      "products": [
        {
          "id": "unique_id_string",
          "name": "Exact Product Name",
          "image": "https://valid-image-url...", 
          "category": "Category Name",
          "rating": 4.5,
          "features": ["Feature 1", "Feature 2"],
          "offers": [
            {
              "store": "Amazon.in",
              "price": 9999,
              "currency": "INR",
              "url": "https://www.amazon.in/...", 
              "inStock": true
            }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      }
    });

    // Use .text property directly
    const text = response.text || "{}";
    const cleanedText = cleanJson(text);
    const data = JSON.parse(cleanedText);
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    if (data.products && Array.isArray(data.products)) {
        return data.products
            .filter((p: any) => p.name)
            .map((p: any, index: number) => {
                let price = 0;
                if (p.offers && p.offers.length > 0) {
                    price = typeof p.offers[0].price === 'number' ? p.offers[0].price : 0;
                }
                const offers = (p.offers && p.offers.length > 0) ? p.offers : [
                    {
                        store: "Best Online Deal",
                        price: price,
                        currency: "INR",
                        url: chunks[0]?.web?.uri || `https://www.google.com/search?q=${encodeURIComponent(p.name)}`,
                        inStock: true
                    }
                ];
                return {
                    id: p.id || `gemini-live-${Date.now()}-${index}`,
                    name: p.name || "Unknown Product",
                    image: p.image || "",
                    category: p.category || "General",
                    rating: typeof p.rating === 'number' ? p.rating : 4.0,
                    features: Array.isArray(p.features) ? p.features.slice(0, 2) : [],
                    offers: offers
                };
            });
    }
    return [];
  } catch (error) {
    console.error("Gemini Universal API Error:", error);
    return [];
  }
};

export const analyzeProductValue = async (product: Product): Promise<string> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const offersText = product.offers.map(o => `${o.store}: ₹${o.price}`).join('\n');
  const prompt = `Analyze this deal for the Indian market: Product: ${product.name}\nOffers:\n${offersText}\nVerdict: Great Buy, Fair Price, or Wait? Max 40 words.`;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    // Use .text property directly
    return response.text || "Analysis unavailable.";
  } catch (error) {
    return "Could not analyze value at this moment.";
  }
};

export const getChatResponse = async (history: { role: 'user' | 'model', text: string }[], newMessage: string): Promise<string> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: newMessage }] }
  ];
  
  const systemInstruction = "You are PriceNexus AI, a concise and expert shopping assistant for the Indian market.";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction, temperature: 0.7 }
    });
    // Use .text property directly
    return response.text || "I'm not sure how to answer that right now.";
  } catch (error) {
    return "I'm having trouble connecting to the server.";
  }
};

export const generateProductImage = async (productName: string): Promise<string | null> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality product photography of ${productName} on a white background.` }],
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    return null;
  }
};
