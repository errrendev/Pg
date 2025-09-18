const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[ 3,'Name must be at least 3 characters long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[ 5,'Email must be at least 5 characters long']
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password must be at least 8 characters long'],
        select:false,
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    emailOTP: {
        type: String,
        select: false,
    },
    emailOTPExpiresAt: {
        type: Date,
        select: false,
    },
});

adminSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET,{ expiresIn:'24h' })
    return token;
}

adminSchema.methods.comparePassword = async function(Password){
    return await bcrypt.compare(Password, this.password);  // Use `this.password` instead of `this._password`
}

adminSchema.statics.hashPassword = async function(Password){
    return await bcrypt.hash(Password,10);
}

adminSchema.methods.setEmailOTP = function(otp, ttlMinutes = 10) {
    this.emailOTP = otp;
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + ttlMinutes);
    this.emailOTPExpiresAt = expiry;
};

adminSchema.methods.verifyEmailOTP = function(otp) {
    if (!this.emailOTP || !this.emailOTPExpiresAt) return false;
    const now = new Date();
    const isValid = this.emailOTP === otp && now <= this.emailOTPExpiresAt;
    return isValid;
};

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;