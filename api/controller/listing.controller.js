import Listing from "../models/listing.model.js";
export const createListing = async(req,res,next)=>{
    try {
        const createListing=await Listing.create(req.body);
        return res.status(200).json(createListing);
    } catch (error) {
        next(error);
    }
}