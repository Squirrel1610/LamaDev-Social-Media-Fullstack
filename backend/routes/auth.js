const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        //save user and response
        const user = await newUser.save();
        return res.status(200).json({
            success: true,
            message: "Register success",
            data: user
        })
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false, 
            message: "Register fail"
        })
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Login success",
            data: user
        })
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            message: "Login fail"
        })
    }
})

module.exports = router;