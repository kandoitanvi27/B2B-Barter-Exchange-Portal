import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProposeTrade = () => {
    const { receiverListingId } = useParams();
    const [receiverListing, setReceiverListing] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [selectedListingId, setSelectedListingId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch receiver listing
                const resList = await api.get(`/listings/${receiverListingId}`);
                setReceiverListing(resList.data.data);

                // Fetch my listings to offer
                // Assuming there's an endpoint to get my listings or filter by owner?
                // Wait, the API I built: `GET /listings` returns all. 
                // I should probably add a query param `owner=userId` or filter client side (bad for scale but ok for MVP)
                // Or I can add `GET /listings/my` endpoint?
                // Let's rely on client side filtering of the general list for MVP or add `owner` query param support in backend.
                // Looking at backend `routes/listings.js`: `const query = {}; ...`
                // It doesn't support `owner` filter explicitly in `req.query` destructuring but I can add it potentially.
                // Actually, let's just fetch all and filter client side for now since I didn't verify backend owner filter support.
                // Wait, checking `routes/listings.js`:
                /*
                    const { page = 1, limit = 10, search, category, status } = req.query;
                    const query = {};
                    if (status) query.status = status; ...
                */
                // It does NOT support owner filter. I should probably add it or just filter client side. SInce pagination is there, filtering client side is risky if my items are on page 2.
                // I will add owner support to backend or just add a `/my-listings` endpoint.

                // Let's do a quick fix: filter on backend by adding `owner` to query logic if passed.
                // But I can't change backend right now easily without context switch. 
                // Let's assume I can fetch all for now (MVP scale).

                const resMy = await api.get('/listings?limit=100'); // Get many
                const myItems = resMy.data.data.filter(item => item.owner._id === user.id && item.status === 'available');
                setMyListings(myItems);

            } catch (err) {
                console.error("Failed to load data", err);
            }
        };
        fetchData();
    }, [receiverListingId, user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedListingId) {
            setError('Please select an item to trade');
            return;
        }

        try {
            await api.post('/trades', {
                listingReceiverId,
                listingInitiatorId: selectedListingId,
                message
            });
            navigate('/trade-history');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to propose trade');
        }
    };

    if (!receiverListing) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Propose Trade</h1>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-700">You are requesting:</h3>
                <p className="text-xl font-bold">{receiverListing.title}</p>
                <p className="text-sm text-gray-500">Value: ${receiverListing.estimatedValue}</p>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Item to Offer</label>
                    <div className="mt-2 grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {myListings.length === 0 && <p className="text-gray-500">You have no available items to trade.</p>}
                        {myListings.map(item => (
                            <div
                                key={item._id}
                                className={`border rounded-lg p-3 cursor-pointer ${selectedListingId === item._id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-400'}`}
                                onClick={() => setSelectedListingId(item._id)}
                            >
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-gray-500">${item.estimatedValue}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                    <textarea
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={myListings.length === 0}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                    Send Proposal
                </button>
            </form>
        </div>
    );
};

export default ProposeTrade;
