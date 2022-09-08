const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//get a post
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Get a post success",
        data: post
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: "Get a post fail"
      });
    }
  });

//create a post 
router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const data =  await newPost.save();
        return res.status(200).json({
            success: true,
            message: "Create post success",
            data
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Create post fail"
        })        
    }
})

//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.userId === req.body.userId) { 
            await post.updateOne({$set: req.body}, {new: true});

            return res.status(200).json({
                success: true,
                message: "Update post success",
            })
        }else{
            return res.status(403).json({
                success: false,
                message: "You can update only your post",
            })
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Update post fail",
        })
    }
})

//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.userId === req.body.userId) { 
            await post.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Delete post success",
            })
        }else{
            return res.status(403).json({
                success: false,
                message: "You can delete only your post",
            })
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Delete post fail",
        })
    }
})

//like or dislike post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            //like  
            await post.updateOne({$push: {likes: req.body.userId}})
            return res.status(200).json({
                success: true, 
                message: "Like post success"
            })
        }else{
            //dislike
            await post.updateOne({$pull: {likes: req.body.userId}})
            return res.status(200).json({
                success: true, 
                message: "Dislike post success"
            })
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Like/dislike post fail"
        })
    }
})

//get timeline posts
router.get("/timeline/all/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const currentUserPost = await Post.find({userId: req.params.userId});
        const friendPost = await Promise.all(currentUser.followings.map((friend) => {
            return Post.find({
                userId: friend
            });
        }))

        const data = currentUserPost.concat(...friendPost);

        return res.status(200).json({
            success: true, 
            message: "Get timeline posts success",
            data
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false, 
            message: "Get timeline posts fail",
            data
        })
    }
})


module.exports = router;