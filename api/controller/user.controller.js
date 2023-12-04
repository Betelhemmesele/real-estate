import Users from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
export const test =(req,res) => {
   
        res.json({
            message:"Welcome to our site",
        });
     }
export const updateUser = async(req,res,next) => {
  if(req.user.id != req.params.id) {
  return next(errorHandler(401,"you can only update your own account"))
  }
  try {
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }
    const updateUser=await Users.findByIdAndUpdate(req.params.id,{
        $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar
        }
    },{new: true})
    const {password, ...rest}= updateUser._doc;
    res.status(200).json(rest);
    console.log(rest);
  } catch (error) {
    
  }
 }
export const deleteUser = async(req, res,next) => {
    if(req.user.id != req.params.id) {
        return next(errorHandler(401,"you can only update your own account"))
        }
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('user deleted successfully');
    } catch (error) {
        next(error);
    }
}
export const getUserListing =async (req,res,next)=>{
    if (req.user.id === req.params.id){
        try {
            const listing = await Listing.find({userRef: req.params.id});
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    }
    else{
        return next(errorHandler(401,'you can only view yours'));
    }
}
export const getUser = async (req, res, next) => {
    try {
      
      const user = await Users.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };