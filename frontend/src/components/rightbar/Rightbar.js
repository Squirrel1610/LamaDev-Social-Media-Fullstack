import "./rightbar.css";
import {Add, Remove} from "@material-ui/icons";
import {Users} from "../../dummyData";
import Online from "../online/Online";
import {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import API from "../../api";
import {AuthContext} from "../../context/AuthContext";
import {Follow, Unfollow } from "../../context/AuthActions";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user?._id])
  

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await API.get("api/users/friends/" + user?._id);
        console.log(response.data.message);
        setFriends(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user?._id]);

  const handleClick = async () => {
    if(followed){
      try {
        const response = await API.put(`api/users/${user._id}/unfollow`, {
          userId: currentUser._id
        })
        
        if(response.data && response.data.success){
          console.log(response.data.message);
          dispatch(Unfollow(user._id));
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }else{
      try {
        const response = await API.put(`api/users/${user._id}/follow`, {
          userId: currentUser._id
        })
        
        if(response.data && response.data.success){
          console.log(response.data.message);
          dispatch(Follow(user._id));
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    
    setFollowed(!followed);
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF + "gift.png"} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={PF + "ad.png"} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {
          user.username !== currentUser.username && (
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove/> : <Add/>}
            </button>
          )
        }
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {
                user?.relationship === 1 
                ? "Single"
                : user?.relationship === 2 
                ? "Married"
                : "-"
              }
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
        {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "default-profile.jpg"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}