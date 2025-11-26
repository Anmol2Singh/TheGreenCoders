import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Activity, TrendingUp, CloudSun, Sprout, Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getWeatherData, getMarketPrices } from '../lib/api';

export default function Home() {
    const { currentUser } = useAuth();
    const [weather, setWeather] = useState(null);
    const [marketData, setMarketData] = useState([]);
    const [recentCards, setRecentCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch weather data
        getWeatherData('Delhi').then(setWeather);

        // Fetch market data
        getMarketPrices().then(data => setMarketData(data.slice(0, 3)));

        // Fetch recent cards from Firestore
        if (currentUser) {
            const q = query(
                collection(db, `users/${currentUser.uid}/cards`),
                orderBy('createdAt', 'desc'),
                limit(3)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const cards = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentCards(cards);
                setLoading(false);
            });

            return unsubscribe;
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome to GreenCoders</h1>
                    <p className="text-green-100 max-w-xl">
                        Your unified platform for Soil Health, Market Intelligence, and Smart Farming.
                        Generate E-Soil Cards and get AI-driven insights.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <Link
                            to="/new-card"
                            className="bg-white text-green-800 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors shadow-md flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Generate New Card
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-600 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-green-900 rounded-full opacity-30 blur-3xl"></div>
            </section>

            {/* Real-time Data Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weather Widget */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Weather Alert</h3>
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
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                        </div>
                    )}
                </motion.div>

                {/* Market Intel Widget */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Market Trends</h3>
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                    {marketData.length > 0 ? (
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
                    ) : (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                        </div>
                    )}
                </motion.div>

                {/* Digital Twin Widget */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Digital Twin</h3>
                        <Sprout className="w-6 h-6 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Simulate crop yield based on current soil data and weather predictions.
                    </p>
                    <Link
                        to="/digital-twin"
                        className="block w-full text-center py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                        Run Simulation
                    </Link>
                </motion.div>
            </div>

            {/* Recent Cards Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Soil Cards</h2>
                    <Link to="/cards" className="text-green-600 text-sm font-medium hover:underline">View All</Link>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <Loader2 className="w-8 h-8 mx-auto mb-3 text-green-600 animate-spin" />
                        <p className="text-gray-500">Loading cards...</p>
                    </div>
                ) : recentCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentCards.map((card) => (
                            <Link
                                key={card.id}
                                to="/cards"
                                className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all hover:border-green-300 group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
                                            {card.farmerName}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {card.village}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <span className="text-gray-500 text-xs block">pH Level</span>
                                        <span className="font-semibold text-gray-700">{card.ph}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <span className="text-gray-500 text-xs block">Org. Carbon</span>
                                        <span className="font-semibold text-gray-700">{card.organicCarbon}%</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No cards generated yet. Start by creating a new one!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
