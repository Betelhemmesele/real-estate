import Users from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
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