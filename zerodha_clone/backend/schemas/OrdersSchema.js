const {Schema} = require("mongoose");

const OrdersSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number,
    type: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = { OrdersSchema };