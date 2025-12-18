import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, Clock, ArrowRightLeft, RefreshCw, XCircle } from 'lucide-react';

const TradeHistory = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const res = await api.get('/trades/history');
                setTrades(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch history", err);
                setLoading(false);
            }
        };
        fetchTrades();
    }, []);

    const handleAction = async (tradeId, action) => {
        try {
            await api.put(`/trades/${tradeId}/${action}`);
            const res = await api.get('/trades/history');
            setTrades(res.data.data);
        } catch (err) {
            console.error(`Failed to ${action} trade`, err);
            alert(`Failed to ${action} trade`);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full"></div></div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
                    <Clock className="h-8 w-8 mr-3 text-indigo-600" />
                    Trade History
                </h1>

                {trades.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                            <ArrowRightLeft className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No trades yet</h3>
                        <p className="mt-2 text-gray-500">Start by proposing a trade from the marketplace.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trades.map(trade => {
                            const isIncoming = trade.receiver._id === user.id;
                            return (
                                <div key={trade._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(trade.status)}`}>
                                                    {trade.status}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(trade.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {trade.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    {isIncoming ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(trade._id, 'accept')}
                                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-sm"
                                                            >
                                                                <Check className="h-4 w-4 mr-1" /> Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(trade._id, 'reject')}
                                                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
                                                            >
                                                                <X className="h-4 w-4 mr-1" /> Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction(trade._id, 'cancel')}
                                                            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" /> Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            {trade.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleAction(trade._id, 'complete')}
                                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-1" /> Mark Complete
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                            {/* Left Side (Offered) */}
                                            <div className="flex-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">
                                                    {isIncoming ? 'They Offer' : 'You Offered'}
                                                </div>
                                                <div className="flex items-center">
                                                    {trade.offeredItem.images && trade.offeredItem.images[0] && (
                                                        <img src={trade.offeredItem.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover mr-3 bg-gray-200" />
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900">{trade.offeredItem.title}</div>
                                                        <div className="text-sm text-gray-500">Value: ${trade.offeredItem.estimatedValue}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Icon */}
                                            <div className="text-gray-300">
                                                <ArrowRightLeft className="h-6 w-6" />
                                            </div>

                                            {/* Right Side (Requested) */}
                                            <div className="flex-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">
                                                    {isIncoming ? 'For Your' : 'For Their'}
                                                </div>
                                                <div className="flex items-center">
                                                    {trade.requestedItem.images && trade.requestedItem.images[0] && (
                                                        <img src={trade.requestedItem.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover mr-3 bg-gray-200" />
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900">{trade.requestedItem.title}</div>
                                                        <div className="text-sm text-gray-500">Value: ${trade.requestedItem.estimatedValue}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {trade.message && (
                                            <div className="mt-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                                <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">Message</span>
                                                <p className="text-sm text-indigo-900 italic">"{trade.message}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradeHistory;
