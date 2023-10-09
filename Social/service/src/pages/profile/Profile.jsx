
import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import {InputText} from "primereact/inputtext"
import { Button } from 'primereact/button';
import axios from "axios";
import { useParams } from "react-router";
import Avatar from 'react-avatar-edit'

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const firstName = useParams().firstName;
  const lastName = useParams().lastName;
  const userId  = useParams().userId ;
  const _id  = useParams()._id;
  const profilePicture = useRef();
  const [Picture, setPicture] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [coverPicture, setcoverPicture] = useState("person/noCover.png");

  const [imagecrop, setimagecrop]= useState(null)
  const [profile, setprofile]= useState([])
  const [src, setsrc]= useState(false)
  const [file, setFile] = useState(null);
  const [pview, setpview] = useState(false);
const [dialogs, setdialogs] =useState(false)
  const profileFinal = profile.map((item)=> item.pview);
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://127.0.0.1:8800/api/users?userId=${userId}`)
      setUser(res.data)
      console.log("res=   ", res.data)
      
    };
    fetchUser();
    
    
  }, [firstName, user._id, userId, lastName, profilePicture]);
  console.log(userId)
  

 
  // const handleClick = async (e) => {
  //  //upload(photo, user)
  // }
  // const handelChange = async (e) => {
  //   if (e.target.files[0]){
  //     setPhoto(e.target.files[0])
  //   }
  // }
const handleClick = async (e) => {
  e.preventDefault();
  const user={
    profilePicture: Picture,

  }
    try {
        await axios.put(`http://127.0.0.1:8800/api/users/${user._id}/`, {
          profilePicture: Picture,
        });
        //console.log("profilePicture==", user.profilePicture)
      }catch (err) {}
    }
  //console.log(user)
 const onClose=() =>{
   setpview(null)
   };

 const onCrop =(view) =>{
     setpview(view)
   };

 const saveCropImage=()=>{
     setprofile([...profile, {pview}]);
     setimagecrop(false)
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop" >
            <div className="profileCover">

              <img

                className="profileCoverImg"
                src={PF+user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              /> 
              
              <div className="profile PictureImg"  >
           <img  
                className="profileUserImg"
                onClick={(handleClick ) => setimagecrop(true)}
                
                src={profileFinal.length ? profileFinal : Picture}
                alt=""
              />
             
             <Dialog
                visible ={imagecrop}
                header={()=>(
                  <p htmlFor="" className="text-2xl font-semibold textColor">
                  Update Profile Picture
                  </p>
                )}
                onHide={()=> setimagecrop(false)}
             >
             <div className="confirmation-content flex flex-column align-items-center">
             <Avatar
                width={500}
                height={400}
                onCrop={onCrop}
                onClose={onClose}
                src={src}
                shadingColor={'#474649'}
                backgroundColor={'#474649'}
              />
              <div className="flex flex-column align-items-center mt-5 w-12">
                <div className="flex justify-content-around w-12 mt-4">
                  <Button 
                    onClick={saveCropImage}
                    label="save"
                    icon="pi pi-check"
                  />
                </div>
              </div>
          </div>

        </Dialog>
            <InputText
              type="file"
              accept="/image/*"
              style={{display:"none"}}
              onChange={(event) =>{
                const file= event.target.files[0];
                if (file && file.type.substring(0, 5) === "profilePicture"){
                      setPicture(file);
                }else{
                  setPicture(Picture);
                }
              }}
            /> 
          </div>  
        </div>
      
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.firstName+" "+user.lastName}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
          
            <Feed user={user} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

