import next from "next";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async(req,res,next)=>{
    try {
        const createListing=await Listing.create(req.body);
        return res.status(200).json(createListing);
    } catch (error) {
        next(error);
    }
}
export const deleteListing =async(req,res,next)=>{
   const lisitng= await Listing.findById(req.params.id);
   if(!lisitng){
    return next(errorHandler(404,"lisitng not found"));
   }
    if (req.user.id !== lisitng.userRef.toString()){
        return next(errorHandler(404,"u can only delete yours"));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('successfully deleted');
    } catch (error) {
       next(error) 
    }
}
// export const updateListing = async (req, res,next) => {
//     const lisitng= await Listing.findById(req.params.id);
//     if(!lisitng){
//      return next(errorHandler(404,"lisitng not found"));
//     }
//     if (req.user.id !== lisitng.userRef.toString()){
//         return next(errorHandler(404,"u can only delete yours"));
//     }
//     try {
//        const updatedListing= await Listing.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {new:true}
//             );
//         res.status(200).json(updateListing);
        
//     } catch (error) {
//         next(error);
//     }
// }
export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };
  
export const getListing = async (req,res,next)=>{
   try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'listing not found'));
    }
    res.status(200).json(listing);
   } catch (error) {
    next(error);
   }
}