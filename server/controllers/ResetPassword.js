const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Reset Password Token

exports.resetPasswordToken = async(req, res) => {
    try{
        //Get Email from request body

        const { email } = req.body;

        //Check user for the email, Email Validation

        const user = await User.findOne({ email });
        if(!user){
            return res.json({
                success: false,
                message: "Email not found",
            });
        }

        //Generate Token

        const token = crypto.randomBytes(20).toString("hex");

        //Update User by adding token and expiration time

        const updatedDetails = await User.findOneAndUpdate({email: email},
                                            {
                                                token: token,
                                                resetPasswordExpires: Date.now() + 5*60*1000, //5 min
                                            },
                                            {new: true}
                                        );
        //create url

        const url = `http://localhost:3000/update-password/${token}`;

        //send email

        await mailSender(email, 
                        "Password Reset",
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`
                        );

        //return response

        return res.json({
            success: true,
            message: "Email sent successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred",
        });
    }
}


//Reset Password Function

exports.resetPassword = async(req, res) => {
    try{
        //Fetch Data

        const {token, password, confirmPassword} = req.body;

        //Validate 

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        //Get User from Database using the above token
        
        const userDetails = await User.findOne({token: token})

        //If no entry - invalid token

        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid Token",   
            });
        }

        //token time check

        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(400).json({
                success: false,
                message: "Token has expired",
            });
        }

        //Hash the password

        const hashedPassword = await bcrypt.hash(password, 10);

        //Update Password

        await User.findOneAndUpdate({token: token},
                                    {password: hashedPassword},
                                    {new: true},
                                );

        //Return response 
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            messgae: error.message,
        });
    }
}

