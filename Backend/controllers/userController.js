const User = require("../models/Users");
const Order = require("../models/Orders");
const bcrypt = require("bcrypt");
const createError = require("../error");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

//-------------------user auth
const userSignUp = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return createError(res, 409, "Email is already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      img: req.file.originalname,
    });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

const userSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return createError(res, 409, "User not found");
    }
    const passwordCheck = await bcrypt.compareSync(password, user.password);

    if (!passwordCheck) {
      return createError(res, 403, "Incorrect Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

//-----------------add to cart------------
const addToCard = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      // console.log('item',item)
      item.product.equals(productId)
    );

    // console.log("existingCartItemIndex", existingCartItemIndex);

    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    // console.log("prod", productIndex, productId, quantity);
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    }
  } catch (err) {
    next(err);
  }
};

//----------------get all cart items----------------
const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Foods",
    });

    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

//-----------------place order-------------
const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const order = new Order({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    await order.save();
    user.cart = [];

    await user.save();

    return res.status(200).json({ message: "Order Place successfully", user });
  } catch (err) {
    next(err);
  }
};

const makeStripePayment =async  (req,res,next)=>{
  try {
    
    const userCartProduct = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if(user){
      const lineItems = userCartProduct.map((product)=>{
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.product.name,
                    images:[product.product.img]
                },
                unit_amount: product.product.price.org*100,
            },
            quantity: product.quantity
        }
    });
      const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"], 
        line_items: lineItems,
        mode: "payment", 
        success_url: "http://localhost:3000/success", 
        cancel_url: "http://localhost:3000/cart", 
      }); 

      res.json({ id: session.id }); 
  }

  } catch (error) {
    return res.status(500).json("Error");
  }
}

//-------------------addd to favpourite-=---------------

const addToFav = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    // console.log("productId", productId, user);
    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Product added to favourite successfully", user });
    } else {
      return res.status(200).json({ message: "Product already in favourite" });
    }
  } catch (err) {
    next(err);
  }
};

const removeFromFav = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    user.favourites = user.favourites.filter((id) => !id.equals(productId));

    await user.save();
    return res
      .status(200)
      .json({ message: "Product removed favourite successfully", user });
  } catch (err) {
    next(err);
  }
};

const getUserFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favourites").exec();

    if (!user) {
      return createError(res, 404, "User not found");
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const {search} = req.query;
    let productListArray = [];
    const usersOrderList = await Order.find({ user: userJWT.id }).populate({
      path: "products.product",
      model: "Foods",
    });
    usersOrderList.map((order) => {
      if (Array.isArray(order.products)) {
        order.products.map((data) => {
          productListArray.push(data);
        });
      }
    });
   
    const regex = new RegExp("^" + search);
    let finalProductListArray = productListArray.filter((items) => {
      return regex.test(items.product.name.toLowerCase());
    });
    
    return res.status(200).json(search!=undefined ? finalProductListArray : productListArray);
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, userEmail } = req.body;
    const existUser = await User.findOne({ email: userEmail });
    console.log('existUser',existUser);
    if (existUser) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      const updateUserPass = await User.findByIdAndUpdate(existUser._id, {
        password: hashedPassword,
      });
      if (updateUserPass) {
        return res.status(201).json("Password Changed Successfully");
      }
    } else {
      return res.status(201).json("User Not Found");
    }
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const imagePath = path.join(__dirname, "../uploads", user.img); // Adjust the image file path

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error("Error reading image:", err);
        return res.status(500).send("Error reading image");
      }
      const base64Image = Buffer.from(data).toString("base64");
      return res.status(201).json(base64Image);
    });
  } catch (error) {
    return res.status(500).json("Error");
  }
};


module.exports = {
  userSignUp,
  userSignIn,
  addToCard,
  getAllCartItems,
  removeFromCart,
  addToFav,
  removeFromFav,
  getUserFavourite,
  placeOrder,
  getAllOrders,
  forgotPassword,
  getUserDetails,
  makeStripePayment
};
