//Check work in comments

const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
require("dotenv").config();
const {uploadDataToCloudinary} = require("../utils/Uploader");

//Create Sub-Section

exports.createSubSection = async (req, res) => {
    try {
      // Extract necessary information from the request body
      const { sectionId, title, description } = req.body
      const video = req.files.video
  
      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || !video) {
        return res
          .status(404)
          .json({ success: false, message: "All Fields are Required" })
      }
      console.log(video)
  
      // Upload the video file to Cloudinary
      const uploadDetails = await uploadDataToCloudinary(
        video,
        process.env.FOLDER_VIDEO
      )
      console.log(uploadDetails)
      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
      })
  
      // Update the corresponding section with the newly created sub-section
      const updatedSection = await Section.findByIdAndUpdate(
        { _id: sectionId },
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection")
  
      // Return the updated section in the response
      return res.status(200).json({ success: true, data: updatedSection })
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating new sub-section:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

//Update Sub-Section

exports.updateSubSection = async(req, res) => {
    try {
        //Fetch data

        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }

        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadDataToCloudinary(
                video,
                process.env.FOLDER_VIDEO
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        // find updated section and return it

        const updatedSection = await Section.findById(sectionId).populate("subSection");
        //console.log("updated section", updatedSection);

        //Check if we have to show updated course content as well.....

        //Return response

        return res.status(200).json({
            success: true,
            message: "Sub-Section updated successfully",
            data: updatedSection,
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


//Delete Sub-Section

exports.deleteSubSection = async(req, res) => {
    try{
        //Fetch data

        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res.status(404).json({ 
                success: false, 
                message: "SubSection not found" 
            });
        }

        // find updated section and return it

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        //Check if we need to delete from course content as well?

        //Return response

        return res.status(200).json({
            success: true,
            message: "Sub-Section deleted successfully",
            data: updatedSection,
        });
        
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}