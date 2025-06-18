import { Schema } from "mongoose";

const PositionsSchema = new Schema({
    name: String,
    quantity: Number,
    averagePrice: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export { PositionsSchema };