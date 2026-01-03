import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Ensure API key is loaded. In a real app, this comes from env vars.
// For the hackathon, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to sanitize JSON from Markdown code blocks or raw text
const cleanJson = (text: string) => {
  // 1. Try to find JSON inside code blocks
  const codeBlockMatch = text.match(/```json([\s\S]*?)```/);
  if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
  }
  
  // 2. If no code block, look for the first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
      return text.substring(firstBrace, lastBrace + 1);
  }

  // 3. Fallback: return as is (cleanup might happen in JSON.parse if it's just whitespace)
  return text.trim();
};

/**
 * Acts as a Universal API Bridge.
 * Since direct client-side API calls to Amazon/Flipkart are CORS-blocked,
 * we use Gemini 2.5 Flash with Google Search Grounding to act as a real-time proxy.
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing. Falling back to mock data.");
    return [];
  }

  // Gemini 2.5 Flash is optimized for speed and tool use (Search Grounding)
  const model = "gemini-2.5-flash"; 

  const prompt = `
    You are a high-performance e-commerce API aggregator. 
    User Query: "${query}"
    
    ACTION: Perform a live Google Search for "${query} price india buy online" to find current product listings.
    
    DATA EXTRACTION RULES:
    1.  Identify EXACTLY 8 DISTINCT and RELEVANT product models matching "${query}".
    2.  For EACH product, find the single BEST available price/offer from a major retailer.
    3.  EXTRACT the specific current price in INR.
    4.  EXTRACT the direct product URL.
    5.  EXTRACT the ACTUAL Product Image URL. 
        - CRITICAL: You must find a direct link to the product image (ending in .jpg, .png, .webp).
        - Search specifically for image source URLs from domains like: 'm.media-amazon.com', 'rukminim1.flixcart.com', 'assets.myntassets.com', 'media-ik.croma.com'.
        - Do NOT use generic placeholders. If specific image not found, leave empty.
    6.  GENERATE a concise list of key features (max 2 items) to save space.
    
    OUTPUT FORMAT:
    You must output strictly VALID JSON. Do not include introductory text.
    {
      "products": [
        {
          "id": "unique_id_string",
          "name": "Exact Product Name",
          "image": "https://image-url...", 
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
        // responseMimeType: "application/json" // REMOVED: Not supported with tools in this version
        temperature: 0.1,
      }
    });

    const text = response.text || "{}";
    const cleanedText = cleanJson(text);
    
    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", text);
        return [];
    }
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    if (data.products && Array.isArray(data.products)) {
        return data.products
            .map((p: any, index: number) => ({
                ...p,
                id: p.id || `gemini-live-${Date.now()}-${index}`,
                image: p.image || "",
                // Ensure there is at least one offer
                offers: (p.offers && p.offers.length > 0) ? p.offers : [
                    {
                        store: "Online Deal",
                        price: p.offers?.[0]?.price || 0,
                        currency: "INR",
                        url: chunks[0]?.web?.uri || `https://www.google.com/search?q=${encodeURIComponent(p.name)}`,
                        inStock: true
                    }
                ]
            }))
            .slice(0, 8); // Ensure we return exactly up to 8 as requested
    }

    return [];

  } catch (error) {
    console.error("Gemini Universal API Error:", error);
    return [];
  }
};

export const analyzeProductValue = async (product: Product): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  const model = "gemini-3-flash-preview";
  
  const offersText = product.offers
    .map(o => `${o.store}: ₹${o.price}`)
    .join('\n');

  const prompt = `
    As a shopping assistant, analyze this deal for the Indian market:
    Product: ${product.name}
    Current Offers:
    ${offersText}
    
    Output a single short paragraph (max 40 words). 
    1. Verdict: Is it a "Great Buy", "Fair Price", or "Wait"?
    2. Why: Briefly mention price history context or feature value.
    Do not use markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    return "Could not analyze value at this moment.";
  }
};