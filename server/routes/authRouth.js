import express from 'express';
import authController from '../controllers/authCont.js';
import userMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/user/register",authController.userRegistration);
router.post("/user/login",authController.userLogin);
router.post('/change-password',userMiddleware,authController.changePassword);
export default router;