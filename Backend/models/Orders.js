const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    total_amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Payment Done",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: "Food",
            require: true,
          },
          quantity: { type: Number, default: 1 },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
