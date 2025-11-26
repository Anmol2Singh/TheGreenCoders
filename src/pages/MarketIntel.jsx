import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMarketPrices } from '../lib/api';

export default function MarketIntel() {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMarketPrices().then(data => {
            setMarketData(data);
            setLoading(false);
        });
    }, []);

    const news = [
        {
            title: "Wheat Prices Rise Due to Export Demand",
            date: "2 hours ago",
            summary: "International demand for Indian wheat has pushed prices up by 2% this week."
        },
        {
            title: "Monsoon Forecast Positive for Kharif Crops",
            date: "5 hours ago",
            summary: "IMD predicts normal rainfall, benefiting rice and cotton cultivation."
        },
        {
            title: "Government Announces MSP Increase",
            date: "1 day ago",
            summary: "Minimum Support Price for major crops increased by 4-6% for the upcoming season."
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Intelligence</h2>
                <p className="text-gray-500">Real-time commodity prices and agricultural news</p>
            </div>

            {/* Market Prices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Today's Mandi Prices</h3>
                    <span className="text-xs text-gray-500">Updated: {new Date().toLocaleTimeString()}</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {marketData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-800 text-lg">{item.crop}</h4>
                                    {item.change >= 0 ? (
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-gray-900">
                                        ₹{item.price}
                                        <span className="text-sm font-normal text-gray-500">/{item.unit}</span>
                                    </div>
                                    <div className={`text-sm font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.change >= 0 ? '+' : ''}{item.change}% from yesterday
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Agricultural News */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-6">
                    <Newspaper className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-800">Agricultural News</h3>
                </div>

                <div className="space-y-4">
                    {news.map((article, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-800">{article.title}</h4>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{article.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">{article.summary}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Data Sources */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>Data Sources:</strong> AgMarkNet, eNAM, and Government Agriculture Portals
                </p>
            </div>
        </div>
    );
}
