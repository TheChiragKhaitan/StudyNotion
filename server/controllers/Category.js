const Category = require("../models/Category");
const Course = require("../models/Course");

//Category Handler Function

exports.createCategory = async (req, res) => {
  try {
    //Fetch data

    const { name, description } = req.body;
    const {user} = req.user.id;

    //Validation
    console.log("user", user)
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //Create Entry in Database

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("categoryDetails are as follows: ",categoryDetails);

    //Return Response

    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Show All Categories Function

exports.showAllCategories = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All Categories Fetched Successfully",
      data: allCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Category Page Details

exports.categoryPageDetails = async (req, res) => {
  try {
    //Fetch Category ID
    const { categoryId } = req.body;
    //console.log("PRINTING CATEGORY ID: ", categoryId);

    // Get courses for the specified category

    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReview" }],
    });

    console.log("SELECTED COURSE", selectedCategory);
    // Handle the case when the category is not found/ Validation

    if (!selectedCategory) {
      //console.log("Category not found.")
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle the case when there are no courses

    if (selectedCategory.courses.length === 0) {
      //console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories(Frequently Brought)

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReview" }],
    });
    let differentCategory = [];
    for (const category of categoriesExceptSelected) {
      differentCategory.push(...category.courses);
    }

    // Get top-selling courses across all categories

    const allCategories = await Category.find().populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReview" }],
    });
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // console.log("mostSellingCourses COURSE", mostSellingCourses)

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add Course To category

exports.addCourseToCategory = async (req, res) => {
  const { courseId, categoryId } = req.body;
  // console.log("category id", categoryId);
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (category.courses.includes(courseId)) {
      return res.status(200).json({
        success: true,
        message: "Course already exists in the category",
      });
    }
    category.courses.push(courseId);
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
