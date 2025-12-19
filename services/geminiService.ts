
import { GoogleGenAI } from "@google/genai";
import { Offer, OfferType, Category, OfferStatus } from "../types";

export async function discoverOffers(query: string): Promise<{ offers: Partial<Offer>[], links: {title: string, uri: string}[] }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const today = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for ACTIVE, publicly available free offers, promo codes, or free trials for: ${query}. 
      PRIORITIZE offers released or verified within the last 30 days.
      Include official links and specify if it is a free trial, promo code, or student offer. 
      Only use public information.
      Provide the result as a raw JSON object string with an "offers" array.
      Use today's date (${today}) for the lastVerifiedDate of found offers.
      Format: { "offers": [{ "toolName": "name", "category": "AI Tools", "type": "Free Trial", "description": "desc", "promoCode": "optional", "sourceUrl": "url", "expiryDate": "optional", "lastVerifiedDate": "${today}" }] }`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    let result = { offers: [] };
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn("AI response parsing failed, using empty results:", parseError);
    }

    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((link: any): link is {title: string, uri: string} => link !== null) || [];

    return {
      offers: Array.isArray(result.offers) ? result.offers : [],
      links: links
    };
  } catch (error) {
    console.error("Error discovering offers:", error);
    return { offers: [], links: [] };
  }
}
