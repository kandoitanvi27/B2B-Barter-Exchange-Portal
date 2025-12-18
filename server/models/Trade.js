const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingInitiator: { // Item offered by initiator (optional in some models, but usually barter is item for item)
        // For MVP ease, let's say Initiator offers CASH or SERVICE or just requests item?
        // Requirement says "exchange goods". So Initiator offers one of their items.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        // required: true // Let's make it optional for now, maybe they just want to request first? No, Barter means exchange.
    },
    listingReceiver: { // Item requested from receiver
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// TradeSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

module.exports = mongoose.model('Trade', TradeSchema);
