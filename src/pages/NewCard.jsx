import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Sprout, Sparkles } from 'lucide-react';
import { generateRecommendations } from '../lib/gemini';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function NewCard() {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('form'); // form, generating, success

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStep('generating');

        const formData = new FormData(e.target);
        const soilData = {
            farmerName: formData.get('farmerName'),
            village: formData.get('village'),
            ph: parseFloat(formData.get('ph')),
            organicCarbon: parseFloat(formData.get('organicCarbon')),
            npk: formData.get('npk'),
        };

        try {
            // Check if farmer already has a card
            if (userProfile.role === 'farmer') {
                const farmerRef = doc(db, 'farmers', userProfile.farmerId);
                const farmerSnap = await getDoc(farmerRef);

                if (farmerSnap.exists() && farmerSnap.data().card) {
                    alert('You already have a soil health card. Farmers can only create one card.');
                    setLoading(false);
                    setStep('form');
                    return;
                }
            }

            // Generate AI recommendations
            const aiRecommendations = await generateRecommendations(soilData);

            const cardData = {
                ...soilData,
                recommendations: formData.get('recommendations') || aiRecommendations,
                createdAt: new Date().toISOString(),
                userId: currentUser.uid,
                farmerId: userProfile.farmerId
            };

            // Save to farmers collection
            const farmerRef = doc(db, 'farmers', userProfile.farmerId);
            await setDoc(farmerRef, {
                userId: currentUser.uid,
                card: cardData,
                hasCard: true,
                updatedAt: new Date().toISOString()
            });

            // Update user profile
            await updateDoc(doc(db, 'users', currentUser.uid), {
                hasCard: true
            });

            setStep('success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error adding card: ", error);
            setLoading(false);
            setStep('form');
            alert("Failed to generate card. Please try again.");
        }
    };

    if (step === 'generating') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-16 h-16 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mt-6">Generating AI Recommendations...</h2>
                <p className="text-gray-500 mt-2">Gemini AI is analyzing your soil data</p>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <CheckCircle className="w-20 h-20 text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mt-6">Card Generated!</h2>
                <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Sprout className="w-6 h-6 text-green-600 mr-2" />
                    Generate New Soil Card
                </h2>
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
                    Powered by Gemini AI for intelligent recommendations
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Farmer's Name</label>
                            <input
                                type="text"
                                name="farmerName"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="Ram Lal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                            <input
                                type="text"
                                name="village"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="Rampur"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                            <input
                                type="number"
                                step="0.1"
                                name="ph"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="6.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organic Carbon (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="organicCarbon"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="0.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NPK (mg/kg)</label>
                            <input
                                type="text"
                                name="npk"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="100:50:50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Recommendations (Optional)</label>
                        <textarea
                            name="recommendations"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="Leave empty for AI-generated recommendations..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Smart Card with AI
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
