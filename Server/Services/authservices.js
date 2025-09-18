const adminModel = require('./../Model/auth');
const crypto = require('crypto');
const transporter = require('./../Config/emailConfig');

module.exports.createAdmin = async ({ name, email, password }) => {
    try {
        // Check for required fields
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }



        // Check if the user already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            throw new Error('Email is already registered');
        }

        // Create the user in the database
        const admin = await adminModel.create({
            name,
            email,
            password,
        });

        // Generate OTP and set expiry
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
        admin.setEmailOTP(otp, 10);
        await admin.save();

        // Send OTP email (non-blocking, but awaited to catch errors)
        const appName = process.env.APP_NAME || 'Our App';
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: `${appName} - Verify your email`,
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
        });

        return admin;
        
    } catch (error) {
        console.error('Error creating Admin:', error);

        // Throw a specific error if email is already registered
        if (error.code === 11000 && error.keyPattern?.email) {
            throw new Error('Email is already registered');
        }

        // Re-throw the error for higher-level handlers
        throw new Error(error.message || 'An unexpected error occurred while creating the Admin');
    }
};

module.exports.sendVerificationOTP = async (admin) => {
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    admin.setEmailOTP(otp, 10);
    await admin.save();
    const appName = process.env.APP_NAME || 'Our App';
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: admin.email,
        subject: `${appName} - Verify your email`,
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });
    return true;
};