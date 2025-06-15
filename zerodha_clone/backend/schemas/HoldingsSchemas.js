const {Schema} =require("mongoose");

const HoldingsSchema = new Schema({
      name: String,
      qty: Number,
      avg: Number,
      price: Number,
      net: String,
      day: String,
      userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
      }
});

module.exports={ HoldingsSchema};