import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCropRecommendations, formatCropRecommendations } from './cropRecommendation';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export async function generateFarmingSchedule(soilData, location, weatherData) {
   try {
      // Get data-driven crop recommendations
      const cropRecommendations = getCropRecommendations(soilData, weatherData, 5);
      const formattedCropRecs = formatCropRecommendations(cropRecommendations, soilData);

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are an expert agricultural advisor. Based on the following soil analysis and crop recommendations, provide detailed farming advice:

SOIL DATA:
- pH Level: ${soilData.ph}
- NPK Values: ${soilData.npk} (N:P:K in mg/kg)
- Organic Carbon: ${soilData.organicCarbon}%
- Location: ${location}

WEATHER DATA:
- Temperature: ${weatherData?.temp || 'N/A'}°C
- Humidity: ${weatherData?.humidity || 'N/A'}%
- Conditions: ${weatherData?.description || 'N/A'}

DATA-DRIVEN CROP RECOMMENDATIONS:
${formattedCropRecs}

Please provide:
1. **Planting Schedule**: Best times to plant the recommended crops
2. **Watering Schedule**: Irrigation frequency and amount
3. **Fertilizer Application**: Specific fertilizer recommendations with quantities
4. **Pest Management**: Common pests for these crops and organic control methods
5. **Harvest Timeline**: Expected harvest periods

Keep the advice practical, specific to the location, and easy to understand for farmers.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
   } catch (error) {
      console.error('Error generating farming schedule:', error);
      return `Based on your soil analysis:

${formatCropRecommendations(getCropRecommendations(soilData, weatherData, 5), soilData)}

**General Recommendations:**
- Monitor soil moisture regularly
- Apply organic compost to improve soil structure
- Rotate crops to maintain soil health
- Test soil every 6 months for optimal results`;
   }
}

export function speakText(text) {
   if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
      return true;
   }
   return false;
}

export function stopSpeaking() {
   if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
   }
};
