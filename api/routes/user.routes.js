import express from 'express';
const router=express.Router();
import { verifyToken } from '../utils/verifyUser.js';
import {test,updateUser,deleteUser} from '../controller/user.controller.js'
router.get('/test',test );
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
 export default router;