import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAssistant } from '../lib/gemini';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I\'m Kisan Sahayak, your AI farming assistant. Ask me anything about soil health, crops, or farming!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Get AI response
            const aiResponse = await chatWithAssistant(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "What crops are good for pH 6.5?",
        "How to improve soil health?",
        "Best fertilizer for wheat?",
        "Signs of nitrogen deficiency?"
    ];

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-700 transition-colors"
            >
                <MessageCircle className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl w-96 h-[500px] overflow-hidden z-50 border border-gray-100 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Kisan Sahayak AI
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-green-800 p-1 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length === 1 && (
                            <div className="px-4 py-2 bg-white border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInput(q);
                                                setTimeout(() => handleSend(), 100);
                                            }}
                                            className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">Powered by Gemini AI</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
