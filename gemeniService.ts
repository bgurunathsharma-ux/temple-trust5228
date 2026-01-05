import { GoogleGenAI } from "@google/genai";
import { Donation, Expense } from "../types";

export const getTrustInsights = async (donations: Donation[], expenses: Expense[], query: string) => {
  // Vite injects this through the define config in vite.config.ts
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "క్షమించండి, AI సేవ అందుబాటులో లేదు. దయచేసి Vercel Environment Variables లో API_KEY సెట్ చేయబడిందో లేదో తనిఖీ చేయండి.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;
  
  const systemInstruction = `మీరు ఒక గౌరవనీయమైన దేవాలయ ట్రస్ట్ మేనేజ్మెంట్ అసిస్టెంట్. 
దయచేసి భక్తులతో మరియు ట్రస్ట్ సభ్యులతో చాలా గౌరవంగా, వినయంగా మాట్లాడండి. 
సమాధానాలు స్పష్టంగా తెలుగులో ఉండాలి.
ప్రస్తుత ట్రస్ట్ లెక్కలు: మొత్తం విరాళాలు ₹${totalDonations.toLocaleString('en-IN')}, మొత్తం ఖర్చులు ₹${totalExpenses.toLocaleString('en-IN')}, నిల్వ ₹${balance.toLocaleString('en-IN')}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "క్షమించండి, సమాధానం దొరకలేదు.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "క్షమించండి, ప్రస్తుతం AI సర్వర్ అందుబాటులో లేదు. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.";
  }
};
