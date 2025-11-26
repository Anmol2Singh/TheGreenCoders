import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Sprout, Droplets, Sun, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_DATA = [
    { day: 'Day 10', yield: 20 },
    { day: 'Day 20', yield: 35 },
    { day: 'Day 30', yield: 50 },
    { day: 'Day 40', yield: 65 },
    { day: 'Day 50', yield: 78 },
    { day: 'Day 60', yield: 85 },
    { day: 'Day 70', yield: 92 },
    { day: 'Day 80', yield: 95 },
    { day: 'Day 90', yield: 100 },
];

export default function DigitalTwin() {
    const [irrigation, setIrrigation] = useState(50);
    const [fertilizer, setFertilizer] = useState(50);
    const [sowingDate, setSowingDate] = useState('2023-11-01');
    const [simulating, setSimulating] = useState(false);
    const [data, setData] = useState(MOCK_DATA);

    const runSimulation = () => {
        setSimulating(true);
        // Simulate calculation delay
        setTimeout(() => {
            // Simple mock logic to vary the graph based on inputs
            const factor = (irrigation + fertilizer) / 100;
            const newData = MOCK_DATA.map(d => ({
                ...d,
                yield: Math.min(100, Math.round(d.yield * factor * 1.1))
            }));
            setData(newData);
            setSimulating(false);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Smart Digital Twin</h2>
                    <p className="text-gray-500">Simulate crop growth scenarios based on inputs.</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                    <Sprout className="w-6 h-6 text-purple-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Panel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Simulation Parameters</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Sun className="w-4 h-4 mr-2 text-orange-500" /> Sowing Date
                        </label>
                        <input
                            type="date"
                            value={sowingDate}
                            onChange={(e) => setSowingDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Droplets className="w-4 h-4 mr-2 text-blue-500" /> Irrigation Level ({irrigation}%)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={irrigation}
                            onChange={(e) => setIrrigation(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Dry</span>
                            <span>Optimal</span>
                            <span>Flood</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Wind className="w-4 h-4 mr-2 text-green-500" /> Fertilizer Dose ({fertilizer}%)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={fertilizer}
                            onChange={(e) => setFertilizer(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Standard</span>
                            <span>High</span>
                        </div>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={simulating}
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:opacity-70"
                    >
                        {simulating ? "Simulating..." : "Run Simulation"}
                    </button>
                </div>

                {/* Visualization Panel */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-6">Projected Yield Growth</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="yield"
                                    stroke="#9333ea"
                                    fillOpacity={1}
                                    fill="url(#colorYield)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-700">
                                {Math.round(data[data.length - 1].yield)}%
                            </div>
                            <div className="text-xs text-purple-600">Est. Yield Efficiency</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-700">Low</div>
                            <div className="text-xs text-green-600">Pest Risk</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-700">₹45k</div>
                            <div className="text-xs text-blue-600">Proj. Profit/Acre</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
