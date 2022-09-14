import "./share.css";
import {PermMedia, Label,Room, EmojiEmotions, Cancel} from "@material-ui/icons"
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState} from "react";
import API from "../../api";

export default function Share() {
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if(file){
      const data = new FormData();
      data.append("file", file);

      try {
        const response = await API.post("api/upload", data);
        console.log(response.data.message);
        newPost.img = response.data.img;
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    try {
      const response = await API.post("api/posts", newPost);
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "default-profile.jpg"} alt="" />
          <input
            placeholder={`What's in your mind ${user.username} ?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr"/>
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption" >
                      <PermMedia htmlColor="tomato" className="shareIcon"/>
                      <span className="shareOptionText">Photo or Video</span>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setFile(e.target.files[0])}
                      />     
                </label>   
                <div className="shareOption">
                    <Label htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <Room htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
            </div>
            <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}