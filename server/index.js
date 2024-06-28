const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const {cloudnairyConnect} = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: "https://studynotion-chirag-khaitan.vercel.app",
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

//cloudinary connect
cloudnairyConnect();

//mounting the routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

//default route
app.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: "Welcome to StudyNotion",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
