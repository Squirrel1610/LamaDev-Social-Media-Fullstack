const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "public/images/" });
const path = require("path");
const fs = require("fs");

const app = express();
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}, () => {
    console.log("Connected to MongoDB");
})

//middleware 
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

//init routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");


//routes
app.get("/", (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
    };

    return res.send(healthcheck);
})

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.post("/api/upload", upload.single("file"), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }
  
    var filePath = `/public/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `${filePath}`);
    
    fs.rename(tempPath, targetPath, async (error) => {
        if (error != null) {
            console.log(error.message)
            return res.status(400).json({
                success: false,
                message: "Rename file failed"
            });
        }
    })

    const fileName = req.file.filename + ".png";


    return res.status(200).json({
        success: true,
        message: "Upload success",
        img: fileName
    });
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listens on port ${port}`);
})