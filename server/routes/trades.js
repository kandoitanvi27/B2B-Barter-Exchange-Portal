const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const Listing = require('../models/Listing');
const Joi = require('joi');
const { protect } = require('../middleware/auth');

// Validation Schema
const tradeSchema = Joi.object({
    listingReceiverId: Joi.string().required(),
    listingInitiatorId: Joi.string().required(), // Trade item for item
    message: Joi.string().allow('')
});

// @route   POST /api/trades
// @desc    Propose a new trade
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { error } = tradeSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { listingReceiverId, listingInitiatorId, message } = req.body;

        // Check if listings exist
        const listingReceiver = await Listing.findById(listingReceiverId);
        if (!listingReceiver) return res.status(404).json({ success: false, error: 'Requested item not found' });

        const listingInitiator = await Listing.findById(listingInitiatorId);
        if (!listingInitiator) return res.status(404).json({ success: false, error: 'Offered item not found' });

        // Check ownership
        if (listingInitiator.owner.toString() !== req.user.id) {
            return res.status(400).json({ success: false, error: 'You do not own the offered item' });
        }

        if (listingReceiver.owner.toString() === req.user.id) {
            return res.status(400).json({ success: false, error: 'Cannot trade with yourself' });
        }

        const trade = await Trade.create({
            initiator: req.user.id,
            receiver: listingReceiver.owner,
            listingInitiator: listingInitiatorId,
            listingReceiver: listingReceiverId,
            message,
            status: 'pending'
        });

        // Update listing status to pending? Usually not until accepted.

        res.status(201).json({
            success: true,
            data: trade
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /api/trades
// @desc    Get user's trades (both sent and received)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const trades = await Trade.find({
            $or: [{ initiator: req.user.id }, { receiver: req.user.id }]
        })
            .populate('initiator', 'username email')
            .populate('receiver', 'username email')
            .populate('listingInitiator', 'title images estimatedValue')
            .populate('listingReceiver', 'title images estimatedValue')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: trades
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   PUT /api/trades/:id
// @desc    Update trade status (Accept/Reject/Cancel)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body; // 'accepted', 'rejected', 'cancelled', 'completed'

        if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const trade = await Trade.findById(req.params.id);
        if (!trade) return res.status(404).json({ success: false, error: 'Trade not found' });

        // Permissions logic
        // Receiver can Accept/Reject
        // Initiator can Cancel
        // Both can Complete?

        if (status === 'accepted' || status === 'rejected') {
            if (trade.receiver.toString() !== req.user.id) {
                return res.status(401).json({ success: false, error: 'Not authorized to accept/reject this trade' });
            }
        }

        if (status === 'cancelled') {
            if (trade.initiator.toString() !== req.user.id && trade.receiver.toString() !== req.user.id) {
                return res.status(401).json({ success: false, error: 'Not authorized' });
            }
        }

        // Update Trade
        trade.status = status;
        await trade.save();

        // If accepted, update listings status to 'pending' or 'traded'?
        if (status === 'accepted') {
            await Listing.findByIdAndUpdate(trade.listingInitiator, { status: 'pending' });
            await Listing.findByIdAndUpdate(trade.listingReceiver, { status: 'pending' });
        }

        if (status === 'completed') {
            await Listing.findByIdAndUpdate(trade.listingInitiator, { status: 'traded' });
            await Listing.findByIdAndUpdate(trade.listingReceiver, { status: 'traded' });
        }

        if (status === 'rejected' || status === 'cancelled') {
            // Revert listings if they were pending
            await Listing.findByIdAndUpdate(trade.listingInitiator, { status: 'available' });
            await Listing.findByIdAndUpdate(trade.listingReceiver, { status: 'available' });
        }

        res.status(200).json({
            success: true,
            data: trade
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
