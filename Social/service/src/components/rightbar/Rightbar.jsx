import "./rightbar.css";
//import {Users} from "../../dummyData";
import Online from "../Online/Online";

import {HomeTwoTone, LocationOnTwoTone, CardTravelTwoTone, SdCardTwoTone,
    FavoriteBorderOutlined,CallOutlined, CakeOutlined} from "@material-ui/icons" 
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';


export default function Rightbar({user}) { 
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const navigate = useNavigate();
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(
      currentUser.followings.includes(user?._id)
    );

    useEffect(() => {
        const getFriends = async () => {
          try {
            const friendList = await axios.get("http://127.0.0.1:8800/api/users/friends/" + user._id);
            setFriends(friendList.data);
          } catch (err) {
            console.log(err);
          }
        };
        getFriends();
      }, [user]);
    
      const handleClick = async () => {
        try {
          if (followed) {
            await axios.put(`http://127.0.0.1:8800/api/users/${user._id}/unfollow`, {
              userId: currentUser._id,
            });
            dispatch({ type: "UNFOLLOW", payload: user._id });
          } else {
            await axios.put(`http://127.0.0.1:8800/api/users/${user._id}/follow`, {
              userId: currentUser._id,
            });
            dispatch({ type: "FOLLOW", payload: user._id });
          }
          setFollowed(!followed);
        } catch (err) {
        }
      };
      
    //  const handlefriend= () => {
    //      navigate(`/profile/${friend._id}`);
    //    };
    const HomeRightbar = () =>{
        return(
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="assets/gift.png" alt=""/>
                    <span className="birthdayText">
                    {" "}
                    <b> Issa Sam</b> and <b> 3 other friends</b> have a birthday today.
                    </span>
                </div>
                <img className="rightbarAd" src="assets/5.jpeg"alt=""/>
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                  {/* {user.map((u)=>(
                    <Online key={u.id} user={u}/>
                ))}   */}
                
            </ul>
            </>
        )
    }
    const ProfileRightbar = () =>{
        return(
            <> 
            {user._id !== currentUser._id && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
                <h4 className="rightbarTitle">Information </h4>
                <div className="rightbarInfo">

                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><LocationOnTwoTone/>City: </span>
                        <span className="rightbarInfokey">{user.city} </span>
                    </div>

                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><HomeTwoTone/>From: </span>
                        <span className="rightbarInfokey"> {user.from} </span>
                    </div>

                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><SdCardTwoTone/>Job: </span>
                        <span className="rightbarInfokey"> {user.job} </span>
                    </div>

                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><CallOutlined/>Phone Number: </span>
                        <span className="rightbarInfokey"> {user.phone_number} </span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><CakeOutlined/>Birthday: </span>
                        <span className="rightbarInfokey"> {user.date_Birth} </span>
                    </div>

                    <div className="rightbarInfoItem">
                        <span className="rightbarInfokey"><FavoriteBorderOutlined/> Relationship:</span>
                        <span className="rightbarInfokey"> {user.relationship} </span>
                    </div>
                </div>
               <h4 className="rightbarTitle">Friends</h4>
                    <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        
                        
                        
                        
                        <div className="rightbarFollowing" onClick={()=>{
                            navigate(`/profile/${friend._id}`);
                            window.location.reload(false)
                        }}>
                        
                            <img 
                             src={
                                friend.profilePicture
                                ? PF + friend.profilePicture
                                : PF + "person/noAvatar.png"
                            } 
                        alt="" className="rightbarFollowingImg"/>
                        
                            <span className="rightbarFollowingName">{friend.firstName}</span>
                            
                        </div>
                    
                        
                        ))}
                    </div>
                    <button className="rightbarButton">Show More</button>

            </>
        )
    }
    return (
        <div className ="rightbar">
            <div className="rightbarWrapper">
              {user ? <ProfileRightbar/> : <HomeRightbar/>}
        </div>
    </div>
)}