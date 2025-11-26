import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const location = useLocation();
    const { logout, isAdmin, isFarmer, userProfile } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white border-b border-green-100 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">GreenCoders</h1>
                        <p className="text-xs text-green-600 font-medium">E-Soil Smart System</p>
                    </div>
                </Link>

                <nav className="flex items-center space-x-4">
                    {/* Role Badge */}
                    <div className="flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                        {isAdmin ? (
                            <>
                                <Shield className="w-4 h-4 text-blue-600 mr-1" />
                                <span className="text-sm font-medium text-blue-600">Admin</span>
                            </>
                        ) : (
                            <>
                                <User className="w-4 h-4 text-green-600 mr-1" />
                                <span className="text-sm font-medium text-green-600">{userProfile?.farmerId}</span>
                            </>
                        )}
                    </div>

                    {/* Dashboard Link */}
                    <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive(isAdmin ? '/admin' : '/dashboard')
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-green-50'
                            }`}
                    >
                        Dashboard
                    </Link>

                    {/* Market Intel - Available to all */}
                    <Link
                        to="/market-intel"
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/market-intel')
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-green-50'
                            }`}
                    >
                        Market
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}
