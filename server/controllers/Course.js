const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadDataToCloudinary} = require("../utils/Uploader");
require("dotenv").config();
const { convertSecondsToDuration}= require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection");

//Create Course Function

exports.createCourse = async (req, res) => {
    try {
        // Get user ID from request object
        
        const userId = req.user.id
    
        // Get all required fields from request body
        
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
        } = req.body
        
        // Get thumbnail image from request files
        
        const thumbnail = req.files.thumbnailImage
    
        // Check if any of the required fields are missing
        
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category
        ){
            return res.status(400).json({
            success: false,
            message: "All Fields are Mandatory",
            })
        }

		//Marking the course as Draft by default if not specified
        if (!status || status === undefined) {
            status = "Draft"
        }

        // Check if the user is an instructor

        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });
    
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }
    
        // Check if the given category is valid

        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            })
        }

        // Upload the Thumbnail to Cloudinary

        const thumbnailImage = await uploadDataToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )
        console.log(thumbnailImage)

        // Create a new course with the given details

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions,
        });
    
        // Add the new course to the User Schema of the Instructor

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )

        // Add the new course to the Categories
        
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )
        
        // Return the new course and a success message
        console.log("Create Course")
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });
    } 
    catch (error) {
        // Handle any errors that occur during the creation of the course
        
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
};

//Get All Courses Function

exports.getAllCourses = async (req, res) => {
    try{
        const allcourses = await Course.find({status: "Published"}, {courseName: true, 
                                                                    thumbnail: true,
                                                                    instructor: true,
                                                                    category: true,
                                                                    price: true,
                                                                    ratingAndReview: true,
                                                                    studentsEnrolled: true,
                                                                    }).populate("instructor").exec();
		console.log("getAllCourses")
        return res.status(200).json({
			
            success: true,  
            data: allcourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't Fetch Course Data",
            error: error.message,
        });
    }
};

//Get Course Details

exports.getCourseDetails = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReview")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
			select: "-videoUrl",
		  },
		})
		.exec()
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	  let totalDurationInSeconds = 0
	  courseDetails.courseContent.forEach((content) => {
		content.subSection.forEach((subSection) => {
		  const timeDurationInSeconds = parseInt(subSection.timeDuration)
		  totalDurationInSeconds += timeDurationInSeconds
		})
	  })
  
	  const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		  totalDuration,
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }
//Edit Course

exports.editCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const updates = req.body
	  const course = await Course.findById(courseId)
  
	  if (!course) {
		return res.status(404).json({ error: "Course not found" })
	  }
  
	  // If Thumbnail Image is found, update it
	  if (req.files) {
		console.log("thumbnail update")
		const thumbnail = req.files.thumbnailImage
		const thumbnailImage = await uploadImageToCloudinary(
		  thumbnail,
		  process.env.FOLDER_NAME
		)
		course.thumbnail = thumbnailImage.secure_url
	  }
  
	  // Update only the fields that are present in the request body
	  for (const key in updates) {
		if (updates.hasOwnProperty(key)) {
		  if (key === "tag" || key === "instructions") {
			course[key] = JSON.parse(updates[key])
		  } else {
			course[key] = updates[key]
		  }
		}
	  }
  
	  await course.save()
  
	  const updatedCourse = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReview")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()
		console.log("editCourse")
	  res.json({
		success: true,
		message: "Course updated successfully",
		data: updatedCourse,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
	}
  }

//Get Full Course Detail

exports.getFullCourseDetails = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const userId = req.user.id
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReview")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()

		
	  let courseProgressCount = await CourseProgress.findOne({
		courseID: courseId,
		userID: userId,
	  })
  
	  console.log("courseProgressCount : ", courseProgressCount)
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	  let totalDurationInSeconds = 0
	  courseDetails.courseContent.forEach((content) => {
		content.subSection.forEach((subSection) => {
		  const timeDurationInSeconds = parseInt(subSection.timeDuration)
		  totalDurationInSeconds += timeDurationInSeconds;
		})
	  })
  
	  const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		  totalDuration,
		  completedVideos: courseProgressCount?.completedVideos
			? courseProgressCount?.completedVideos
			: ["none"],
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }

//Get Instructor Courses

exports.getInstructorCourses = async (req, res) => {
	try {
		// Get instructor ID from request object
		const instructorId  = req.user.id;

		// Find all courses of the instructor
		const instructorCourses  = await Course.find({ instructor: instructorId  })
															.sort({ createdAt: -1 })
															.populate({
																path: "courseContent",
																populate: {
																 	path: "subSection",
																},
															})
															.exec();
		// Return all courses of the instructor
		res.status(200).json({
			success: true,
			data: instructorCourses ,
		});
	} catch (error) {
		// Handle any errors that occur during the fetching of the courses
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
	}
}

//Delete The course

exports.deleteCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  // Find the course
	  const course = await Course.findById(courseId)
	  if (!course) {
		return res.status(404).json({ message: "Course not found" })
	  }
  
	  // Unenroll students from the course
	  const studentsEnrolled = course.studentsEnrolled
	  for (const studentId of studentsEnrolled) {
		await User.findByIdAndUpdate(studentId, {
		  $pull: { courses: courseId },
		})
	  }
  
	  // Delete sections and sub-sections
	  const courseSections = course.courseContent
	  for (const sectionId of courseSections) {
		// Delete sub-sections of the section
		const section = await Section.findById(sectionId)
		if (section) {
		  const subSections = section.subSection
		  for (const subSectionId of subSections) {
			await SubSection.findByIdAndDelete(subSectionId);
		  }
		}
  
		// Delete the section
		await Section.findByIdAndDelete(sectionId)
	  }
  
	  // Delete the course
	  await Course.findByIdAndDelete(courseId)

	  //Delete course id from Category
	  await Category.findByIdAndUpdate(course.category._id, {
		$pull: { courses: courseId },
	     })
	
	//Delete course id from Instructor
	await User.findByIdAndUpdate(course.instructor._id, {
		$pull: { courses: courseId },
		 })
		 
		 console.log("delete course")
	  return res.status(200).json({
		success: true,
		message: "Course deleted successfully",
	  })
	} catch (error) {
	  console.error(error)
	  return res.status(500).json({
		success: false,
		message: "Server error",
		error: error.message,
	  })
	}
  }

//Search Course

exports.searchCourse = async (req, res) => {
	try {
	  const  { searchQuery }  = req.body
	//   console.log("searchQuery : ", searchQuery)
	  const courses = await Course.find({
		$or: [
		  { courseName: { $regex: searchQuery, $options: "i" } },
		  { courseDescription: { $regex: searchQuery, $options: "i" } },
		  { tag: { $regex: searchQuery, $options: "i" } },
		],
  })
  .populate({
	path: "instructor",  })
  .populate("category")
  .populate("ratingAndReview")
  .exec();

  return res.status(200).json({
	success: true,
	data: courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}		
}