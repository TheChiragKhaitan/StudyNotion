const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req, res, next) => {
    try {
        //Fetch token

        const token =  req.cookies.token 
                       || req.body.token 
                       || req.header("Authorization").replace("Bearer ", "");

        //Check if token present

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        //Verification of token

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is an authorized route for Students only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User Role Can't be Verified",
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is an authorized route for Instructors only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User Role Can't be Verified",
        })
    }
}

//Admin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is an authorized route for Admins only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User Role Can't be Verified",
        })
    }
}