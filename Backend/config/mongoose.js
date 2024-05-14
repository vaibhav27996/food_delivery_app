const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);
const db=mongoose.connection;
db.on('error',(err)=>{console.log("Error in connecting db",err)});
db.once('open',()=>{
    console.log("Connected to db");
});

module.exports=db;