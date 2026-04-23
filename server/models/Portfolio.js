const mongoose = require('mongoose');

const holdingSchema = mongoose.Schema({
    stockSymbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    avgPrice: {
        type: Number,
        default: 0
    }
});

const portfolioSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    holdings: [holdingSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
