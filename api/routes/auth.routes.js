import express from 'express';
const router=express.Router();
import {signup,signin,google,signout} from '../controller/auth.controller.js';
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signout);
export default router;
