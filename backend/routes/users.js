const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user 
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id){
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, 
            {
                new: true
            });

            return res.status(200).json({
                success: true,
                message: "Account has been updated",
                data: user
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "Update account fail"
            })
        }
    }else{
        return res.status(403).json({
            success: false,
            message: "You can update only your account"
        })
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id){
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Delete account success"
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "Delete account fail"
            })
        }
    }else{
        return res.status(403).json({
            success: false,
            message: "You can delete only your account"
        })
    }
})


//get a user
router.get("/", async (req, res) => {
    try {
        const userId = req.query.userId;
        const username = req.query.username;

        const user = userId 
        ? await User.findById(userId)
        : await User.findOne({username});
        const {password, updatedAt, ...other} = user._doc;
        return res.status(200).json({
            success: true,
            message: "Get a user success",
            data: other
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Get a user fail"
        })
    }
})

//follow a user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $push: {followers: req.body.userId}
                })
                await currentUser.updateOne({
                    $push: {followings: req.params.id}
                })

                return res.status(200).json({
                    success: true,
                    message: "Follow user success"
                })
            }else{
                return res.status(403).json({
                    success: false,
                    message: "You have already followed this user"
                })
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "Follow user fail"
            })
        }
        
    }else{
        return res.status(403).json({
            success: false,
            mesaage: "You can't follow yourself"
        })
    }
})

//unfollow user
router.put("/:id/unfollow", async (req, res) =>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $pull: {followers: req.body.userId}
                })
                await currentUser.updateOne({
                    $pull: {followings: req.params.id}
                })
                
                return res.status(200).json({
                    success: true,
                    message: "Unfollow user success"
                })
            }else{
                return res.status(403).json({
                    success: false,
                    message: "You have already unfollowed this user"
                })
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "Unfollow user fail"
            })
        }
    }else{
        return res.status(403).json({
            success: false,
            mesaage: "You can't unfollow yourself"
        })
    }
})

//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      return res.status(200).json({
        success: true,
        message: "Get friend list success",
        data: friendList
      })
    } catch (err) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Get friend list fail"
        });
    }
  });

module.exports = router;