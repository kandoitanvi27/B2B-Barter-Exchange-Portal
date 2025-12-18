import { Link } from 'react-router-dom';
import { Tag, MapPin, DollarSign } from 'lucide-react';

const ListingCard = ({ listing }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col group">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
            ${listing.status === 'available' ? 'bg-green-100 text-green-700' :
                            listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'}`}
                    >
                        {listing.status}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {listing.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {listing.title}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {listing.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center text-gray-700 font-bold">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        {listing.estimatedValue}
                    </div>
                    <Link
                        to={`/listings/${listing._id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                    >
                        Details &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
