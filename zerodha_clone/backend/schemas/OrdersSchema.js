import { Schema } from "mongoose";

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

export { OrdersSchema };