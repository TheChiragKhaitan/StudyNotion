const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60, // 5 minutes
    },
});

async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email", emailTemplate(otp));
        console.log("Email Sent Sucessfully: ", mailResponse);
    }
    catch(error){
        console.log("Error occured while sending Email: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    console.log("New document created to database");

    // Only send an email when a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;