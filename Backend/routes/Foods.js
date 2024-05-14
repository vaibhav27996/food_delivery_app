const express = require('express');
const router = express.Router();
const {addProducts,getFoodItems,getFoodById} = require('../controllers/foodController.js')  


router.post("/addProduct",addProducts);
router.get('/',getFoodItems);
router.get('/:id',getFoodById);
module.exports=router;