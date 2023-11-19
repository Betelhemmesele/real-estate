import Users from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { response } from 'express';
export const signup =async(req,res,next)=>{
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new Users({ username, email, password: hashedPassword });
    try {
      await newUser.save();
      res.status(201).json('User created successfully!');
    } catch (error) {
      next(errorHandler(550,'error form the function'));
    }
};
export const signin =async(req,res,next)=>{
  const {email,password}=req.body;
  try {
    const user=await Users.findOne({email});
    if (!user) return next(errorHandler(404,'user not found!'));
    const userPassword=bcryptjs.compareSync(password,user.password)
    if (!userPassword) return next(errorHandler(401,'wrong credential!'));
    const token =jwt.sign({id:user.id},process.env.JWT_SECRET);
    const{password:pass ,...restInfo}=user._doc;
    res.cookie('access_token',token,{httpOnly:true})
       .status(200)
       .json(restInfo);
  } catch (error) {
    next(error);
  }
}