const adminModel = require('./../Model/auth');
const adminService = require('./../Services/authservices');
const { validationResult } = require('express-validator');


module.exports.regesterAdmin = async function (req, res, next) {
    try {
        // Validate input fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;



        const isAdminAlreadyExist = await adminModel.findOne({ email: email, })
        if (isAdminAlreadyExist) {
            return res.status(400).json({ error: 'Admin with this email already exists' });
        }
        
        // Check for missing fields
        if (!name  || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        

        // Hash the password
        const hashPassword = await adminModel.hashPassword(password);



        // Create the user and send OTP
        const admin = await adminService.createAdmin({
            name,
            email,
            password: hashPassword
        });
        // Do not issue token until email verified
        res.status(200).json({ message: 'Registration successful. Please verify your email with the OTP sent.' });
    } catch (error) {
        console.error('Error registering Admin:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // General server error
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};



module.exports.loginUser = async function (req, res, next) {
    try {
        // Validate incoming request (await for asynchronous validation)
        const errors =  validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Find user by email, including password for comparison
        const admin = await adminModel.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare entered password with the stored password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!admin.isVerified) {
            await adminService.sendVerificationOTP(admin);
            return res.status(403).json({ message: 'Email not verified. OTP sent to your email.' });
        }

        // Generate JWT token and set secure cookie
        const token = admin.generateAuthToken();
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Send response without token in body
        return res.status(200).json({ admin });
    } catch (error) {
        console.error('Login error:', error);

        // Handle unexpected errors
        return res.status(401).json({ error: 'An unexpected error occurred, please try again later' });
    }
};

module.exports.getUserProfile = async function (req, res, next) {

    res.status(200).json(req.user)
}

module.exports.logoutUser = async function (req, res, next){
    try {
        const isProd = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
        });
        return res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to log out' });
    }
};

module.exports.verifyEmail = async function (req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        const admin = await adminModel.findOne({ email }).select('+emailOTP +emailOTPExpiresAt');
        if (!admin) return res.status(404).json({ error: 'User not found' });

        if (!admin.verifyEmailOTP(otp)) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        admin.isVerified = true;
        admin.emailOTP = undefined;
        admin.emailOTPExpiresAt = undefined;
        await admin.save();

        // Issue cookie token after verification
        const token = admin.generateAuthToken();
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Email verified', admin });
    } catch (error) {
        console.error('Verify email error:', error);
        return res.status(500).json({ error: 'Failed to verify email' });
    }
};

module.exports.resendOTP = async function (req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const admin = await adminModel.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'User not found' });
        if (admin.isVerified) return res.status(400).json({ error: 'Already verified' });
        await adminService.sendVerificationOTP(admin);
        return res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({ error: 'Failed to resend OTP' });
    }
};