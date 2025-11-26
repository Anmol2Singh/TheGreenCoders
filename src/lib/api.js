// Weather API integration
export const getWeatherData = async (city = 'Delhi') => {
    try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            // Return mock data if API fails
            return {
                temp: 28,
                description: 'Sunny',
                humidity: 45,
                alert: 'High chance of pest activity in cotton crops due to humidity.'
            };
        }

        const data = await response.json();
        return {
            temp: Math.round(data.main.temp),
            description: data.weather[0].main,
            humidity: data.main.humidity,
            alert: data.main.humidity > 60
                ? 'High humidity detected. Monitor crops for fungal diseases.'
                : 'Weather conditions are favorable for farming.'
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return {
            temp: 28,
            description: 'Sunny',
            humidity: 45,
            alert: 'High chance of pest activity in cotton crops due to humidity.'
        };
    }
};

// Market data from AgMarkNet (using mock data as API requires authentication)
export const getMarketPrices = async () => {
    try {
        // Mock data based on typical Indian market prices
        return [
            { crop: 'Wheat', price: 2125, change: 2, unit: 'q' },
            { crop: 'Rice', price: 1950, change: -1, unit: 'q' },
            { crop: 'Maize', price: 1800, change: 5, unit: 'q' },
            { crop: 'Cotton', price: 6500, change: 3, unit: 'q' },
            { crop: 'Sugarcane', price: 315, change: 0, unit: 'q' }
        ];
    } catch (error) {
        console.error('Market API error:', error);
        return [];
    }
};

// Soil health data integration (mock for now)
export const getSoilHealthData = async (location) => {
    try {
        // This would integrate with https://soilhealth.dac.gov.in/ API when available
        return {
            status: 'Available',
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Soil health API error:', error);
        return null;
    }
};
