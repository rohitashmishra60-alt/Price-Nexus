import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";


// Ensure API key is loaded.
const apiKey = process.env.API_KEY;
// Safely initialize. If no key, we can't really use AI, but we shouldn't crash.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

  // 3. Fallback: return as is
  return text.trim();
};

/**
 * Acts as a Universal API Bridge using Gemini 3 Flash Preview.
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!ai || !apiKey) {
    console.warn("Gemini API Key missing. Falling back to mock data.");
    return [];
  }

  // Using the latest preview model for best search grounding capability
  const model = "gemini-3-flash-preview"; 

  const prompt = `
    You are a high-performance e-commerce API aggregator. 
    User Query: "${query}"
    
    ACTION: Perform a live Google Search for "${query} buy online price india" to find current product listings AND images.
    
    DATA EXTRACTION RULES:
    1.  Identify EXACTLY 10-12 DISTINCT and RELEVANT product models matching "${query}".
        - WE NEED HIGH QUANTITY. Do not stop at 3 or 4. Dig deeper into the search results to find a full list.
    2.  For EACH product, find the single BEST available price/offer.
    3.  EXTRACT the specific current price in INR.
    4.  EXTRACT the direct product URL.
    5.  EXTRACT the ACTUAL Product Image URL. 
        - CRITICAL: You MUST find a valid image URL for the product. 
        - Prioritize direct image files (.jpg, .png, .webp).
        - If a direct retailer image is protected, USE A THUMBNAIL from the search results (gstatic, etc).
        - If a specific product shot is unavailable, use a valid generic image of the BRAND or CATEGORY found in search results, rather than returning null.
        - The goal is to return as many products with images as possible.
    6.  GENERATE a concise list of key features (max 2 items, e.g. "ANC, 30h Battery").
    
    OUTPUT FORMAT:
    You must output strictly VALID JSON. Do not include any conversational text before or after the JSON.
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
        temperature: 0.1, // Low temperature for factual extraction
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
            .filter((p: any) => p.name) // Allow missing images initially, we will gen them
            .map((p: any, index: number) => {
                // Ensure numeric price
                let price = 0;
                if (p.offers && p.offers.length > 0) {
                    price = typeof p.offers[0].price === 'number' ? p.offers[0].price : 0;
                } else if (typeof p.price === 'number') {
                    price = p.price;
                }

                // Construct fallback offers if needed
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
                    image: p.image || "", // Allow empty string
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
  if (!ai || !apiKey) return "API Key missing.";

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

/**
 * Handles chat interactions using Gemini 3 Pro Preview.
 */
export const getChatResponse = async (history: { role: 'user' | 'model', text: string }[], newMessage: string): Promise<string> => {
    if (!ai || !apiKey) return "I can't chat right now because the API key is missing. Please add it to your environment variables.";
  
    const model = "gemini-3-pro-preview";
  
    // Map internal message history to the format expected by the SDK
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: newMessage }]
      }
    ];
  
    const systemInstruction = `
      You are PriceNexus AI, a helpful and expert shopping assistant.
      Your goal is to help users find products, understand technical specifications, and compare prices.
      
      Guidelines:
      1. Be concise but informative.
      2. If the user asks about a specific product, assume they are shopping in India (INR currency) unless specified otherwise.
      3. If you don't know a real-time price, suggest they use the dashboard's search bar to find live deals.
      4. Use a friendly, professional tone.
      5. Do not use markdown for simple text responses unless necessary for lists.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text || "I'm not sure how to answer that right now.";
    } catch (error) {
      console.error("Chat API Error:", error);
      return "I'm having trouble connecting to the server. Please try again later.";
    }
  };

/**
 * Generates a product image using Gemini if one is missing or broken.
 */
export const generateProductImage = async (productName: string): Promise<string | null> => {
  if (!ai || !apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-quality commercial product photography of ${productName} centered on a clean white background. Studio lighting, photorealistic, 4k resolution, sleek and modern.`,
          },
        ],
      },
    });

    // Iterate to find image part
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};