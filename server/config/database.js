const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch( (error) => {
        console.log("Connection to MongoDB Failed");
        console.error(error);
        process.exit(1);
    } )
};