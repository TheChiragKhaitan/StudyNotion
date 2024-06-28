const { contactUsEmail } = require("../mail/templates/contactFormRes")             //contactUsEmail is the format/style of email which is send to the user;
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {

  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body

  try {
    await mailSender( email, "Your Data was send successfully", contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode))
    await mailSender( "chiragkhaitan2014@gmail.com" , "The Following Information was Submitted on Studynotion", contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode))

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  }
   catch (error) {
      return res.json({
        success: false,
        message: "Something went wrong...",
      })
  }
}