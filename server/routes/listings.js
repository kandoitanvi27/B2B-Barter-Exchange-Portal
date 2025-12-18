const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Joi = require('joi');
const { protect } = require('../middleware/auth');

// Validation Schema
const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().valid('Electronics', 'Furniture', 'Clothing', 'Services', 'Vehicles', 'Other').required(),
    estimatedValue: Joi.number().required(),
    condition: Joi.string().valid('New', 'Like New', 'Good', 'Fair', 'Poor'),
    images: Joi.array().items(Joi.string().uri())
});

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { error } = listingSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const listing = await Listing.create({
            ...req.body,
            owner: req.user.id
        });

        res.status(201).json({
            success: true,
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /api/listings
// @desc    Get all listings (with pagination and search)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        else query.status = 'available'; // Default to available only

        if (category) query.category = category;

        if (search) {
            query.$text = { $search: search };
        }

        const listings = await Listing.find(query)
            .populate('owner', 'username email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Listing.countDocuments(query);

        res.status(200).json({
            success: true,
            data: listings,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('owner', 'username email');

        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.status(200).json({
            success: true,
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        // Check ownership
        if (listing.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this listing' });
        }

        listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        // Check ownership
        if (listing.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
