const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: 'text' // For search
    },
    description: {
        type: String,
        required: true,
        index: 'text'
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Furniture', 'Clothing', 'Services', 'Vehicles', 'Other']
    },
    estimatedValue: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        default: 'Good'
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'traded'],
        default: 'available',
        index: true
    },
    images: [{
        type: String // URL
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', ListingSchema);
