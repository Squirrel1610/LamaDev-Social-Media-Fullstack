import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import API from "../../api";
import {format} from "timeago.js"
import {AuthContext} from "../../context/AuthContext";
import {Link} from "react-router-dom";

export default function Post({ post }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user} = useContext(AuthContext);

  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id))
  const [userPost, setUserPost] = useState({});
  

  useEffect(() => {
    setIsLiked(post.likes.includes(user._id));
  }, [post, user])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response = await API.get(`api/users?userId=${post.userId}`);
        
        if(response.data && response.data.success){
          console.log(response.data.message);
          setUserPost(response.data.data);
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }

    fetchUser();
  }, [post])

  const likeHandler = async () =>{
    try {
      const response = await API.put(`api/posts/${post._id}/like`, {userId: user._id});
      console.log(response.data.message);
      setLike(isLiked ? like-1 : like+1)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error(error.response.data.message);
    }  
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
          <Link to={`/profile/${userPost.username}`}>
            <img
                className="postProfileImg"
                src={userPost.profilePicture ? PF + userPost.profilePicture : PF + "default-profile.jpg"}
                alt=""
            />
          </Link>
            <span className="postUsername">
              {userPost.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post?.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={PF + "heart.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post?.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}