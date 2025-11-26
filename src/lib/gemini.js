import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyCUBmeaACBsfB0IEcfZ2ZaFWGZaSy6eA5M';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateRecommendations = async (soilData) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
            }
        });

        const prompt = `As an agricultural expert, analyze this soil data and provide brief recommendations for Indian farmers:

pH: ${soilData.ph}
Organic Carbon: ${soilData.organicCarbon}%
NPK: ${soilData.npk}
Location: ${soilData.village}

Provide 2-3 sentences covering suitable crops, fertilizer needs, and soil improvements.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Recommendation error:", error);
        return "Apply balanced NPK fertilizer. Add organic compost to improve soil health. Consider crops suitable for your soil pH level.";
    }
};

export const chatWithAssistant = async (userMessage) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 150,
            }
        });

        const prompt = `You are Kisan Sahayak, a helpful farming assistant for Indian farmers. Answer briefly in 2-3 sentences.

Question: ${userMessage}

Answer:`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Chat error:", error.message);
        return "I'm having trouble right now. Please try asking your question again.";
    }
};
