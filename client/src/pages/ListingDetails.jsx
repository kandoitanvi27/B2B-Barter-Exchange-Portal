import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, DollarSign, Tag, Info, AlertCircle, Edit, ExternalLink } from 'lucide-react';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const { data } = await api.get(`/listings/${id}`);
                setListing(data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full"></div></div>;
    if (error) return <div className="text-center py-20 text-red-600 font-medium">{error}</div>;
    if (!listing) return <div className="text-center py-20 text-gray-600">Product not found</div>;

    const isOwner = user && listing.owner && user.id === listing.owner._id;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Back to Marketplace
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 h-96 md:h-auto bg-gray-100 relative">
                            {listing.images && listing.images.length > 0 ? (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <div className="mb-2">No Image Available</div>
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                    {listing.category}
                                </span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:w-1/2 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center text-gray-500 text-sm mb-6">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>Listed by {listing.owner?.username}</span>
                                        <span className="mx-2">•</span>
                                        <span className={`font-medium ${listing.status === 'available' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-sm text-gray-600 mb-8 flex-grow">
                                <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-2">Description</h3>
                                <p>{listing.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Estimated Value</div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center">
                                        <DollarSign className="w-5 h-5 text-indigo-500 mr-1" />
                                        {listing.estimatedValue}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Condition</div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {listing.condition}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                {isOwner ? (
                                    <Link
                                        to={`/edit-listing/${listing._id}`}
                                        className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Listing
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/propose-trade/${listing._id}`}
                                        className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold shadow-lg transform transition-all hover:-translate-y-0.5"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Propose Trade
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
