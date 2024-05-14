const Food = require("../models/Foods");
const createError = require("../error");

const addProducts = async (req, res, next) => {
  try {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
      return createError(res, 400, "Invalid Request");
    }

    let createFoods = [];
    for (const foodInto of foodData) {
     
      const { name, desc, img, price, ingredients, category } = foodInto;

      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });

      const newlyFood = await product.save();
      createFoods.push(newlyFood);

      return res.status(201).json({
        message: "Products added Successfully",
        createFoods,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query;
    ingredients = ingredients?.split(",");
    categories = categories?.split(",");
   
    const filter = {};
    if (categories && Array.isArray(categories)) {
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }
    if (ingredients && Array.isArray(ingredients)) {
      filter.ingredients = { $in: ingredients }; // Match products in any of the specified ingredients
    }
    if (maxPrice || minPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
    }
    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }

    const foodList = await Food.find(filter);
    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};


const getFoodById = async (req, res, next) => {
  try {
    let {id} = req.params;

    const getFood = await Food.findById(id);

    if(!getFood){
      return createError(res,404,"Food not found");
    }
    return res.status(200).json(getFood)

    
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addProducts,
  getFoodItems,
  getFoodById
};
