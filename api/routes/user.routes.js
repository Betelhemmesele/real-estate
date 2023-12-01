import express from 'express';
const router=express.Router();
import { verifyToken } from '../utils/verifyUser.js';
import {test,updateUser,deleteUser,getUserListing} from '../controller/user.controller.js'
router.get('/test',test );
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListing);
 export default router;