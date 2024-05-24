const express= require('express');
const cors =require('cors');
const db= require('./config/mongoose');
const app = express();
const UserRoutes =  require('./routes/Users');
const FoodRoutes =  require('./routes/Foods');
const path = require('path');
const {errorHandlerMiddleware} =require('./error');

require('dotenv').config();
db; 
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));
app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message
    });
});

app.use('/images', express.static(path.join(__dirname, '/uploads')));

app.get("/",async(req,res)=>{
    res.status(200).json({
        message:"Hello vaibhav"
    })
})


app.use('/user',UserRoutes);
app.use('/food',FoodRoutes);
app.use(errorHandlerMiddleware);


app.listen(process.env.PORT,()=>{
    
    console.log('Server is running on port',process.env.PORT)
})
