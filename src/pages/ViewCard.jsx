import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sprout, MapPin, Droplets, Activity, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ViewCard() {
    const [searchParams] = useSearchParams();
    const [cardData, setCardData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const data = searchParams.get('data');
            if (data) {
                const parsed = JSON.parse(decodeURIComponent(data));
                setCardData(parsed);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error parsing card data:', err);
            setError(true);
        }
    }, [searchParams]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Sprout className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Card Data</h2>
                    <p className="text-gray-500 mb-6">The QR code data could not be read.</p>
                    <Link to="/" className="text-green-600 hover:underline">Go to Home</Link>
                </div>
            </div>
        );
    }

    if (!cardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">E-Soil Health Card</h1>
                                <p className="text-green-100">The GreenCoders Initiative</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg">
                                <QRCodeSVG value={JSON.stringify(cardData)} size={64} fgColor="#166534" />
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 space-y-6">
                        {/* Farmer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Farmer Name</label>
                                <p className="text-xl font-bold text-gray-800">{cardData.farmerName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" /> Village
                                </label>
                                <p className="text-xl font-bold text-gray-800">{cardData.village}</p>
                            </div>
                        </div>

                        {/* Soil Parameters */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Soil Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center">
                                    <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <label className="text-xs text-blue-700 uppercase font-bold block mb-1">pH Level</label>
                                    <p className="text-3xl font-bold text-blue-900">{cardData.ph}</p>
                                </div>
                                <div className="bg-green-50 p-5 rounded-xl border border-green-100 text-center">
                                    <Sprout className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <label className="text-xs text-green-700 uppercase font-bold block mb-1">Organic Carbon</label>
                                    <p className="text-3xl font-bold text-green-900">{cardData.organicCarbon}%</p>
                                </div>
                                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 text-center">
                                    <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <label className="text-xs text-purple-700 uppercase font-bold block mb-1">NPK Values</label>
                                    <p className="text-xl font-bold text-purple-900">{cardData.npk}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">AI Recommendations</h3>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                                <p className="text-gray-700 leading-relaxed">{cardData.recommendations}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                Generated on {new Date(cardData.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Card ID: {cardData.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
