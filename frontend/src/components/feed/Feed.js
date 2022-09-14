import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import API from "../../api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({username}) {
  const {user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response = username ? await API.get(`api/posts/profile/${username}`) : await API.get(`api/posts/timeline/${user._id}`);
        
        if(response.data && response.data.success){
          console.log(response.data.message);
          setPosts(response.data.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          }));
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    }

    fetchPosts();
  }, [username, user])

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}