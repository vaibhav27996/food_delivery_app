const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  userSignUp,
  userSignIn,
  addToCard,
  getAllCartItems,
  addToFav,
  getUserFavourite,
  removeFromFav,
  removeFromCart,
  placeOrder
  ,getAllOrders,forgotPassword,getUserDetails
} = require("../controllers/userController.js");

const auth = require("../authenticate.js");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });
router.post("/signup",upload.single('img'), userSignUp);
router.post("/signin", userSignIn);
router.post("/forgotPassword", forgotPassword);

router.get("/getImage",auth,getUserDetails)

//order place
router.post("/order", auth, placeOrder);
router.get("/getAllOrders",auth,getAllOrders)

//cart
router.post("/cart", auth, addToCard);
router.get("/cart", auth, getAllCartItems);
router.patch("/cart", auth, removeFromCart);

// Favourite
router.post("/favourite", auth, addToFav);
router.get("/favourite", auth, getUserFavourite);
router.patch("/favourite", auth, removeFromFav);

module.exports = router;
