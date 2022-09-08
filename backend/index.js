const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");

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
app.use(helmet());
app.use(morgan("common"));

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

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

const port = process.env.PORT;

app.listen(port, () => {
    console.log("Server listens on port " + port);
})

