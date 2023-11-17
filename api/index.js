import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.mongo).then(()=>{
    console.log('connectd to db');
}).catch((err)=>{
  console.log(err);
});

const app = express();
app.listen(4000,() => {
    console.log("listening on 4000");
});