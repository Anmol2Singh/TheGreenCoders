import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getWeatherData, getMarketPrices } from '../lib/api';
import { generateFarmingSchedule, speakText, stopSpeaking } from '../lib/aiRecommendations';
import { Sprout, MapPin, CloudSun, TrendingUp, Sparkles, Volume2, VolumeX, Loader2, Plus, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

export default function FarmerDashboard() {
    const { currentUser, userProfile } = useAuth();
    const [card, setCard] = useState(null);
    const [weather, setWeather] = useState(null);
    const [marketData, setMarketData] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('');
    const cardRef = useRef(null);

    useEffect(() => {
        if (currentUser && userProfile) {
            loadFarmerData();
        }
    }, [currentUser, userProfile]);

    const loadFarmerData = async () => {
        try {
            const farmerRef = doc(db, 'farmers', userProfile.farmerId);
            const farmerSnap = await getDoc(farmerRef);

            if (farmerSnap.exists()) {
                const cardData = farmerSnap.data();
                setCard(cardData.card);
                setLocation(cardData.card.village);

                const weatherData = await getWeatherData(cardData.card.village);
                setWeather(weatherData);

                const recommendations = await generateFarmingSchedule(
                    cardData.card,
                    cardData.card.village,
                    weatherData
                );
                setAiRecommendations(recommendations);
            }

            const market = await getMarketPrices();
            setMarketData(market.slice(0, 3));

            setLoading(false);
        } catch (error) {
            console.error('Error loading farmer data:', error);
            setLoading(false);
        }
    };

    const toggleSpeech = () => {
        if (isSpeaking) {
            stopSpeaking();
            setIsSpeaking(false);
        } else {
            const success = speakText(aiRecommendations);
            if (success) {
                setIsSpeaking(true);
                setTimeout(() => setIsSpeaking(false), aiRecommendations.length * 50);
            }
        }
    };

    const downloadCard = async () => {
        if (!cardRef.current) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const fileName = `soil-card-${userProfile.farmerId}.png`;

            link.setAttribute('download', fileName);
            link.setAttribute('href', dataUrl);
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading card:", error);
            alert("Failed to download card. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-2xl p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Farmer Dashboard</h1>
                        <p className="text-green-100">Farmer ID: {userProfile?.farmerId}</p>
                    </div>
                    {!card && (
                        <Link
                            to="/new-card"
                            className="bg-white text-green-800 px-4 py-2 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Card
                        </Link>
                    )}
                </div>
            </div>

            {/* Real-time Data Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weather Widget */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Weather - {location || 'Your Location'}</h3>
                        <CloudSun className="w-6 h-6 text-orange-500" />
                    </div>
                    {weather ? (
                        <>
                            <div className="text-3xl font-bold text-gray-800">{weather.temp}°C</div>
                            <p className="text-sm text-gray-500">{weather.description}, Humidity {weather.humidity}%</p>
                            <div className="mt-4 p-3 bg-orange-50 text-orange-700 text-xs rounded-lg border border-orange-100">
                                {weather.alert}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Create a card to see weather data</p>
                    )}
                </motion.div>

                {/* Market Trends */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Market Trends</h3>
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                    <ul className="space-y-3">
                        {marketData.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{item.crop}</span>
                                <span className={`font-bold ${item.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    ₹{item.price}/{item.unit} ({item.change >= 0 ? '+' : ''}{item.change}%)
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* AI Recommendations Section */}
            {card && aiRecommendations && (
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                            <h3 className="text-lg font-bold text-gray-800">AI Farming Recommendations</h3>
                        </div>
                        <button
                            onClick={toggleSpeech}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isSpeaking
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                        >
                            {isSpeaking ? (
                                <>
                                    <VolumeX className="w-4 h-4 mr-2" />
                                    Stop Reading
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Read Aloud
                                </>
                            )}
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                            {aiRecommendations}
                        </pre>
                    </div>
                </div>
            )}

            {/* My Card Section with QR Code */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Soil Health Card</h2>
                {card ? (
                    <>
                        <div ref={cardRef} className="bg-gradient-to-br from-white to-green-50 p-8 rounded-xl shadow-sm border-2 border-green-200">
                            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-green-100">
                                <div>
                                    <h3 className="text-2xl font-bold text-green-800">E-Soil Health Card</h3>
                                    <p className="text-sm text-green-600">The GreenCoders Initiative</p>
                                    <p className="text-xs text-gray-500 mt-1">Farmer ID: {userProfile.farmerId}</p>
                                </div>
                                <div className="text-center bg-white p-3 rounded-lg border-2 border-green-500">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            farmerId: userProfile.farmerId,
                                            farmerName: card.farmerName,
                                            village: card.village,
                                            ph: card.ph,
                                            npk: card.npk,
                                            organicCarbon: card.organicCarbon
                                        })}
                                        size={100}
                                        level="H"
                                        fgColor="#166534"
                                        includeMargin={true}
                                    />
                                    <p className="text-xs text-gray-600 mt-2">Scan QR Code</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Farmer Name</label>
                                    <p className="text-lg font-semibold text-gray-800">{card.farmerName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" /> Village
                                    </label>
                                    <p className="text-lg font-semibold text-gray-800">{card.village}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">pH Level</label>
                                    <p className="text-lg font-semibold text-gray-800">{card.ph}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Organic Carbon</label>
                                    <p className="text-lg font-semibold text-gray-800">{card.organicCarbon}%</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">NPK Values (N:P:K)</label>
                                    <p className="text-lg font-semibold text-gray-800">{card.npk} mg/kg</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Recommendations</label>
                                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100 mt-1">
                                        {card.recommendations}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 text-center text-xs text-gray-400 border-t border-green-100 pt-4">
                                Generated on {new Date(card.createdAt).toLocaleDateString('en-IN')} | Powered by GreenCoders AI
                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={downloadCard}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download Card as PNG
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <Sprout className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-4">You haven't created your soil health card yet.</p>
                        <Link
                            to="/new-card"
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your Card
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
