const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { mongoose } = require("mongoose");

//Create Rating

exports.createRating = async (req,res) => {
    try {
        const userId=req.user.id;
        const {rating, review, courseId} = req.body;

        //Check if User is Enrolled Or Not in the Course

        const courseDetails= await Course.find(
                                        {_id: courseId,
                                        studentsEnrolled: {$elemMatch:{$eq:userId}}
                                        });
        
        //Validation

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message: "Student not enrolled in course"
            });
        };

        //If Already Reviewed

        const alreadyReviewed =await RatingAndReview.findOne({user:userId,
                                                            course:courseId});
    
        if(alreadyReviewed){
            return res.status(404).json({
                success: false,
                message: "You have already reviewed the Course"
            });
        }

        //Create Rating & Review

        const ratingReview= await RatingAndReview.create(
                                                    {
                                                        rating,
                                                        review,
                                                        course:courseId,
                                                        user:userId
                                                    });

        //Update The Course
        
        const updatedCourse = await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                                ratingAndReview: ratingReview._id
                                            }
                                        },{new:true});

        //Return response
        
        return res.status(200).json({
            success: true,
            message: "Rating added successfully",
            ratingReview,
            data: updatedCourse,
        });
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
};

//Get Average Rating For the Course

exports.getAverageRating = async (req, res) => {
    try {

        //get course ID

        const courseId = req.body.courseId;    

        //Get Average Rating
        
        const result = await RatingAndReview.aggregate([
            {
                // it find all entry in which id of courses is matched with courseId in RatingAndReview models
                $match:{course: new mongoose.Types.ObjectId(courseId),},        
            },
            {
                //all entry grouped into single grouped due to (_id:null) and then find averageRating
                $group:{ _id:null,  averageRating: { $avg: "$rating"},}         
            }
        ]);

        //return rating

        if(result.length > 0){                                                   
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating/Review exist
 
        return res.status(200).json({                                          
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try{
        //Get all The Reviews
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})  //Sort from 5 to 1 star(descending)
                                                            .populate({
                                                                path:"user",
                                                                select:"firstName lastName email image",
                                                            })
                                                            .populate({
                                                                path:"course",
                                                                select: "courseName",
                                                            })
                                                            .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
};
