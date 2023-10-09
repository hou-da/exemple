import "./post.css";
import { MoreVert, ChatBubbleOutline  } from "@material-ui/icons";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

export default function Post({ post, socket}) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser.firstName));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://127.0.0.1:8800/api/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
    console.log("post.userId", post.userId)
  }, [post.userId]);
  const handleDelete = async()=>{
    try{
      axios.delete(`http://127.0.0.1:8800/api/posts/`+ post._id, {userId: currentUser._id} )
      console.log("userId", currentUser._id)
    }catch (err) {}

  }

  const likeHandler = () => {
    try {
      axios.put("http://127.0.0.1:8800/api/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    console.log(currentUser.firstName) 
     socket.emit("sendNotification", {
      senderName: user,
      receiverName: currentUser.firstName,
      
       });
    };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user._id}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.firstName+" "+user.lastName}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight" onClick={handleDelete}>
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          {post.desc && <p className="postText">{post?.desc}</p>}
          {post.img && <img className="postImg" src={PF + post.img} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft"> 
          {isLiked ? (
            
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              alt=""
              onClick={likeHandler}
            />):( 
              <img
              className="likeIcon"
              src={`${PF}like.png`}
              alt=""
              onClick={likeHandler}
            />
            )}
            
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
          <ChatBubbleOutline />
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}