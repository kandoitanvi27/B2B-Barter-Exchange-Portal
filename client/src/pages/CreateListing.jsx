import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const CreateListing = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        estimatedValue: '',
        condition: 'Good',
        images: '' // Simple string for now, could be array
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/listings', {
                ...formData,
                estimatedValue: Number(formData.estimatedValue),
                images: formData.images ? [formData.images] : []
            });
            navigate('/marketplace');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create listing');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">List New Item</h1>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. MacBook Pro 2021"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="Describe the condition, specs, and includes..."
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-shadow"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option>Electronics</option>
                                <option>Furniture</option>
                                <option>Clothing</option>
                                <option>Services</option>
                                <option>Vehicles</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select
                                name="condition"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-shadow"
                                value={formData.condition}
                                onChange={handleChange}
                            >
                                <option>New</option>
                                <option>Like New</option>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Poor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                name="estimatedValue"
                                required
                                className="mt-1 block w-full pl-7 px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                value={formData.estimatedValue}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            name="images"
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            value={formData.images}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:-translate-y-0.5"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
