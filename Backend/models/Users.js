const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    favourites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Foods",
        default:[]
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Order",
        default:[]
    },
    cart: {
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
        default:[]
      },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;