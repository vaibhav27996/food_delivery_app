const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    price: {
      type: {
        org:{type:Number,default:0.0},
        mrp:{type:Number,default:0.0},
        off:{type:Number,default:0},
      },
      default:{org:0.0,mrp:0.0,off:0}
    },

    category:{
        type:[String],
    },
    ingredients:{
        type:[String],
        require:true
    }
  },
  {
    timestamps: true,
  }
);
const Food = mongoose.model("Foods", foodSchema);
module.exports = Food;
