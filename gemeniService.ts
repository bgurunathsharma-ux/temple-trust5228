import { GoogleGenAI } from "@google/genai";
import { Donation, Expense } from "../types";

export const getTrustInsights = async (donations: Donation[], expenses: Expense[], query: string) => {
  // Always use a new instance to ensure the latest API key from process.env is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;
  
  const systemInstruction = `మీరు ఒక గౌరవనీయమైన దేవాలయ ట్రస్ట్ మేనేజ్మెంట్ అసిస్టెంట్. 
దయచేసి భక్తులతో మరియు ట్రస్ట్ సభ్యులతో చాలా గౌరవంగా, వినయంగా మాట్లాడండి. 
సమాధానాలు స్పష్టంగా తెలుగులో ఉండాలి.
ప్రస్తుత లెక్కలు: మొత్తం విరాళాలు ₹${totalDonations}, మొత్తం ఖర్చులు ₹${totalExpenses}, నిల్వ ₹${balance}.
విరాళాల జాబితా: ${JSON.stringify(donations.slice(0, 5))}
ఖర్చుల జాబితా: ${JSON.stringify(expenses.slice(0, 5))}`;

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
    return "క్షమించండి, ప్రస్తుతం AI సర్వర్ అందుబాటులో లేదు. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ లేదా API Key సరిచూసుకోండి.";
  }
};