const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const adminController = require('./../Controller/auth')
const authMiddleware = require('./../Middleware/authMiddleware')

router.post('/register',[
    body('name').notEmpty().isLength({ min:3}).withMessage('First name must be at lest 3 character long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],
    adminController.regesterAdmin
);

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],
    adminController.loginUser 
);

router.get('/profile', authMiddleware.authUser, adminController.getUserProfile);

router.get('/logout', authMiddleware.authUser, adminController.logoutUser)

router.post('/verify-email', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('otp').isLength({ min: 4 }).withMessage('OTP is required'),
], adminController.verifyEmail);

router.post('/resend-otp', [
    body('email').isEmail().withMessage('Please enter a valid email'),
], adminController.resendOTP);

module.exports = router