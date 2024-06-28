const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

//Create Section

exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			data: updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Section Creation Failed",
			error: error.message,
		});
	}
};


//Update Section

exports.updateSection = async(req, res) => {
    try{
        //Fetch data

        const {sectionId, sectionName, courseId} = req.body;
        console.log(req.body);
        //Validation

        if(!sectionId || !sectionName){
            return res.status(400).json({
                success: false,
                error: "Please fill all the fields",
            });
        }

        //Update Section
        
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});
        console.log(section);
        const course = await Course.findById(courseId)      
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		}).exec();
        console.log(course);
        //Return response

        return res.status(200).json({ 
            success: true,
            message: "Section updated successfully",
			data: course
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

//Delete Section

exports.deleteSection = async(req, res) => {
    try{

        //fetch data 

        const { sectionId, courseId }  = req.body;
        
        //delete from course
		
        await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})

		const section = await Section.findById(sectionId);
		//console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
        
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 

		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		}).exec();

        //return response

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
			data: course
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};