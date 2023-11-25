import express from 'express';
const router=express.Router();
import { verifyToken } from '../utils/verifyUser.js';
import {test,updateUser} from '../controller/user.controller.js'
router.get('/test',test );
router.post('/update/:id',verifyToken,updateUser);
 export default router;