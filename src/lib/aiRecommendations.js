import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyCUBmeaACBsfB0IEcfZ2ZaFWGZaSy6eA5M';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateFarmingSchedule = async (soilData, location, weather) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        });

        const prompt = `As an agricultural expert, create a detailed farming schedule and recommendations for an Indian farmer:

Soil Data:
- pH: ${soilData.ph}
- Organic Carbon: ${soilData.organicCarbon}%
- NPK: ${soilData.npk}
- Location: ${location}
- Current Weather: ${weather.description}, ${weather.temp}°C

Provide specific recommendations in this format:

1. WHAT TO PLANT:
   - Best crops for this soil (2-3 crops)
   
2. WHEN TO PLANT:
   - Ideal planting months
   
3. WATERING SCHEDULE:
   - Frequency and amount
   
4. FERTILIZER & PESTICIDES:
   - Types and quantities
   - Application timing
   
5. EXPECTED HARVEST:
   - Timeline and yield estimate

Keep language simple and practical for Indian farmers.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI recommendations error:", error);
        return `Based on your soil data:

1. WHAT TO PLANT:
   - Wheat (suitable for pH ${soilData.ph})
   - Mustard crops

2. WHEN TO PLANT:
   - October-November (Rabi season)

3. WATERING SCHEDULE:
   - Water every 7-10 days
   - 50-60mm per irrigation

4. FERTILIZER & PESTICIDES:
   - Apply NPK ${soilData.npk} at sowing
   - Urea top dressing after 30 days

5. EXPECTED HARVEST:
   - March-April (4-5 months)
   - Expected yield: 40-45 quintals/hectare`;
    }
};

// Text-to-speech function
export const speakText = (text) => {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.85;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
        return true;
    }
    return false;
};

// Stop speech
export const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};
