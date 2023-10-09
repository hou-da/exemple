import "./topbar.css"
import {SearchTwoTone, Person, GroupTwoTone, NotificationsActiveTwoTone,LogoutSharp, HomeTwoTone, ChatTwoTone } from "@material-ui/icons" 
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate} from "react-router-dom"
import axios from "axios";
import {Navigate} from "react-router-dom";
import { io } from "socket.io-client";

export default function Topbar({socket}) {

    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

      useEffect(() => {
      const search = async()=>{
        try{
          const res= await axios.get('http://127.0.0.1:8800/api/users/all')
            //setUsers(res.data)
            setFilterData(res.data)
            //console.log(users)
        }catch(err) 
        {console.log(err)}
      }
        
      search()  
     }, []);
    const Filter = (value) =>{
      const serch = filterData.filter(f => f.firstName.toLowerCase().includes(value))
                setUsers(serch)
                console.log("serch",serch)
    }              

    useEffect(() => {
    const  socket = io("http://localhost:3000");
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [...prev, data]);
         });
         //console.log("socket   = ", socket)
         console.log("notifications=     ", notifications)
      }, [notifications]);
  
    const displayNotification = ({ senderName, type}) => {
        let action;

    if (type === 1) {
      action = "liked";
    }
    return(
        <span className="notification">{`${senderName} ${action} your post.`}</span>)
          //console.log("senderName=",senderName) 
       };

    const handleRead = () => {
        setNotifications();
        setOpen(false);
       };
       const handleHome= () => {
        navigate('/home');
        window.location.reload(false)
      };
      const handleProfile= () => {
        navigate(`/profile/${user._id}`);
        window.location.reload(false)
      };
      const handlemessage= () => {
        navigate('/messenger');
        window.location.reload(false)
      };
      const handlelogout= () => {
        
        navigate('/login');
        localStorage.clear()
        window.location.reload(false)
      };
    
     
 return(

    <div className ="topbarContainer">
      <div className="topbarLeft ">
          <Link to="/home" style={{ textDecoration: "none" }}>
              <span className="logo">Isend</span>
          </Link>
          <div className="topbarIcons">
              <div className="topbarLeftIconItem">
                <Person/>
                  <span className="topbarLeftIconBadge">1</span>
              </div>
                   
            </div>
                
      </div>
      <div className="topbarCenter ">
        <div className= "searchbar">
            <SearchTwoTone/>
              <input className="searchInput"
                    placeholder= "Search for friend, groups, post or video" 
                    onChange={e => Filter(e.target.value)}
              />
              
        </div>
        <div className="search-result">
         { users.map((d, i)=> (
         <div key={i}>
         {d.firstName +" "+ d.lastName}
         
         </div>
          ) )} 
        
      </div>
      </div>

      <div className="topbarRight ">
        <div className="topbarIcons">
            <div className="topbarRightIconItem">
              <HomeTwoTone onClick={handleHome}/>
                <span className="topbarRightIconBadge">1</span>
            </div>
           <div className="topbarRightIconItem">
              <ChatTwoTone onClick={handlemessage}/>
                <span className="topbarRightIconBadge">2</span>
            </div>
            <div className="topbarRightIconItem" onClick={() => setOpen(!open)}>
              <NotificationsActiveTwoTone/>
                  {notifications.length >0 &&
                      <div className="topbarRightIconBadge">{notifications.length}</div>
                        } 
            </div>
            {open && (
              <div className="notifications">
                      {notifications.map((n) => displayNotification(n))}
                      <button className="nButton" onClick={handleRead}>

                      </button>
              </div>
            )} 
            </div>
              <div className="">
                <img onClick={handleProfile}
                             src={user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noAvatar.png"
                            }
                            alt=""
                        className="topbarImg"
                />
              </div>
              <div className="" onClick={handlelogout}  >
                < span className="logout" >Logout</span>
              </div>
             </div>
        </div>
     )
    }