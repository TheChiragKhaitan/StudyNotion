const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

//Send OTP Function
exports.sendOTP = async (req,res) => {
    try{
        //fetch data from body of request
        const {email} = req.body;

        //check if user already exists
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP Generated: ",otp);

        //check unique otp
        const checkUniqueOtp = await OTP.findOne({otp: otp});
        while(checkUniqueOtp){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
        }
        
        const otpPayload = {email, otp};

        //create entry for OTP in Database to match 
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        //return response as succssful
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


//Sign Up Function
exports.signUp = async(req, res) => {
    try{
        //Fetch data from request body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
            contactNumber,
        } = req.body;

        //Validate the User
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            })
        }

        //Match the Passwords
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        //Check user already exists
        const checkUserExist = await User.findOne({email});
        if(checkUserExist){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //Find most recent OTP stored for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        //Validate OTP
        if(recentOtp.length === 0 ){
            return res.status(400).json({
                success: false,
                message: "OTP Not Found",
            });
        }
        else if(otp !== recentOtp.otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        //Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        //Create the User
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender: null,
            contactNumber: null,
            about: null,
            dateOfBirth: null,
        });

        //Create Entry in Database
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id, 
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
        });

        //Return Response
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Login Function
exports.login = async(req, res) => {
    try{
        //Fetch the data from request body
        const { email, password } = req.body;

        //Validate the User
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        //Check if User registered or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not registered, Please Sign Up to Continue",
            });
        }

        //Create JWT Token if password matches
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn : "24h",
            });

            // Save token to user document in database
            user.token = token;
            user.password = undefined;

            //Create Cookie and Send Response
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Change Password Function
exports.changePassword = async(req, res) => {
    try {

        // Fetch user data

        const userDetails = await User.findById(req.user.id)
    
        // Get old password, new password, and confirm new password from req.body

        const { oldPassword, newPassword, confirmNewPassword } = req.body
    
        // Validate old password
        
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)

        if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}

        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res.status(401).json({ 
                success: false, 
                message: "The password is incorrect", 
            });
        }

        //Match New Password and Confirm New Password
        if (newPassword !== confirmNewPassword) {
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}
    
        // Update password

        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )
    
        // Send notification email
        
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Study Notion - Password Updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            
            console.log("Email sent successfully: ", emailResponse.response)
        } 
        catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }
    
        // Return success response

        return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
    } 
    catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error

        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    } 
};