const express = require("express")
const router = express.Router()

//Route for :- createCourse , Section(add, update, delete) , Subsection(add, update, delete), getAllCourses, getCoursesDetails;
//Route for :- createCategory , showAllCategories , getCategoryPageDetails
//Route for :-  createRating , getAverageRating , getReviews
//Route for :- updateCourseProgress

 
const {createCourse,  getAllCourses,  getCourseDetails,  getFullCourseDetails, editCourse, getInstructorCourses,  deleteCourse, searchCourse,} = require("../controllers/Course")               // Course Controllers Import
const {showAllCategories, createCategory, categoryPageDetails, addCourseToCategory, } = require("../controllers/Category")      // Categories Controllers Import
const {createSection,  updateSection,  deleteSection, } = require("../controllers/Section")                // Sections Controllers Import
const {createSubSection, updateSubSection,  deleteSubSection, } = require("../controllers/SubSection")     // Sub-Sections Controllers Import
const {createRating,  getAverageRating, getAllRating, } = require("../controllers/RatingAndReview")        // Rating Controllers Import
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")                          // Importing Middlewares
const {updateCourseProgress } = require("../controllers/CourseProgress");


// ********************************************************************************************************
//                                      Course routes (only by Instructors)                               *
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse)                            // Courses can Only be Created by Instructors
router.post("/addSection", auth, isInstructor, createSection)                            //Add a Section to a Course
router.post("/updateSection", auth, isInstructor, updateSection)                         // Update a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)                         // Delete a Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)                   // Edit Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getAllCourses", getAllCourses)                                               // Get all Registered Courses
router.post("/getCourseDetails", getCourseDetails)                                        // Get Details for a Specific Courses

router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/editCourse", auth, isInstructor, editCourse)                              // Edit Course routes
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)           // Get all Courses Under a Specific Instructor
router.delete("/deleteCourse", deleteCourse)                                            // Delete a Course
router.post("/searchCourse", searchCourse)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


// ********************************************************************************************************
//                                      Category routes (Only by Admin)                                   *
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getcategoryPageDetails", categoryPageDetails)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// ********************************************************************************************************
//                                      Rating and Review (only by Student)                               *
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router