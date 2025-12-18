import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, RefreshCw, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
                                <RefreshCw className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                BarterX
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-medium text-gray-600 hidden md:block">
                                Welcome, {user?.username}
                            </span>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Trade What You Have, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                            Get What You Need
                        </span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        The premium B2B marketplace for cashless exchanges. Unlock value from your surplus inventory today.
                    </p>
                    <Link to="/marketplace" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg transition-transform hover:scale-105 shadow-xl">
                        Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Dashboard Actions */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Action Card 1 */}
                    <Link to="/marketplace" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                            <ShoppingBag className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Marketplace</h3>
                        <p className="text-gray-500">Discover items for trade from other businesses.</p>
                    </Link>

                    {/* Action Card 2 */}
                    <Link to="/create-listing" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
                        <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                            <LayoutDashboard className="h-6 w-6 text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Items</h3>
                        <p className="text-gray-500">Post your surplus inventory and receive offers.</p>
                    </Link>

                    {/* Action Card 3 */}
                    <Link to="/trade-history" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
                        <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors">
                            <Clock className="h-6 w-6 text-pink-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Trade History</h3>
                        <p className="text-gray-500">Track your proposals and completed exchanges.</p>
                    </Link>
                </div>

                {/* Recent Activity Section (Placeholder logic) */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-indigo-600">Active</div>
                            <div className="text-sm text-gray-500 mt-1">Status</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-gray-500 mt-1">Pending Trades</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-pink-600">0</div>
                            <div className="text-sm text-gray-500 mt-1">Completed</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-gray-600">100%</div>
                            <div className="text-sm text-gray-500 mt-1">Reputation</div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                    &copy; 2025 BarterX Exchange Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
