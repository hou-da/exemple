import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import * as webRTCHandler from '../../utils/webRTC/webRTCHandler';

import Message from "../../components/message/Messages";
import ChatOnline from "../../components/ChatOnline/ChatOnline";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { SentimentSatisfiedSharp, SendSharp, PhoneTwoTone, VideocamTwoTone, PersonAddTwoTone, Filter,AttachFile, Cancel } from "@material-ui/icons";
import Picker from "emoji-picker-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { callToOtherUser } from '../../utils/webRTC/webRTCHandler';
import { callStates } from '../../store/actions/callActions';
import CallingDialog from '../../components/call/CallingDialog/CallingDialog';
import IncomingCallDialog from '../../components/call/IncomingCallDialog/IncomingCallDialog';

export default function Messenger(props) {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [file, setFile] = useState(null);
  const [doc, setDoc] = useState(null);
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [friend, setFriend]= useState()
  const { activeUser, callState } = props;
  console.log(user)
 
  useEffect(() => {
  
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        img: data.img,
        fichier: data.fichier,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8800/api/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8800/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

useEffect( ()=> { 

  const getMember = async () => {
    try {
      const IdMember= 
      currentChat?.members?.find(
        (member) => member !== user._id
      )
      const res = IdMember?await axios("http://127.0.0.1:8800/api/users?userId=" + IdMember):{};
      setFriend(res.data)

    } catch (err) {
      console.log(err);
    }
  };
  getMember();
  console.log("kkkk=",currentChat)
},[currentChat])

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      
      conversationId: currentChat._id,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      message.img = fileName;
      console.log(message);
 
    
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
  
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      img: newMessage,
      fichier: newMessage,
    });
    try {
      await axios.post("http://127.0.0.1:8800/api/upload", data);
      window.URL.createObjectURL(data) 
       
      } catch (err) {}
  }
  if (doc) {
    const data = new FormData();
    const fileName = Date.now() + doc.name;
    data.append("name", fileName);
    data.append("file", doc);
    message.fichier = fileName;
    console.log(message);

  
  const receiverId = currentChat.members.find(
    (member) => member !== user._id
  );

  socket.current.emit("sendMessage", {
    senderId: user._id,
    receiverId,
    text: newMessage,
    img: newMessage,
  });
  try {
    await axios.post("http://127.0.0.1:8800/api/upload", data);
    window.URL.createObjectURL(data) 
     
    } catch (err) {}
}

    try {
      const res = await axios.post("http://127.0.0.1:8800/api/messages", message);
      //window.location.reload();
      setMessages([...messages, res.data]);
      setNewMessage("");
      setFile("")
      setDoc("")
      
    } catch (err) {
      console.log(err);
    }
  };
 

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    const handleListItemPressed = () => {
      
    const friendId= currentChat.members.find(
         (member) => member !== user._id
      );
      console.log(friendId,user._id)
     
      callToOtherUser(friendId,user._id);
      
      
      window.open('/dashboard', "blank");
    //navigate('/call'[target = "_blank"])
    
    }
   
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
             {conversations.map((c) => (
               
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))} 
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          
            {currentChat ? (
              
              <>
              
              <div className="chatInfo">
              
                <span>{friend?.firstName+" "+friend?.lastName}</span> 
                  <div className="chatIcons">
                    <div className="Call">
                      <PhoneTwoTone onClick="" />
                    </div>
                    < div className="videoicon">
                    
                    <VideocamTwoTone  onClick={handleListItemPressed}
                      
                    />
                    
                   </div>
                    <div className="AddPersonne">
                      <PersonAddTwoTone  />
                    </div>
                  </div>
                </div>
             
                <div className="chatBoxTop" >
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                {file && (
                <div className="chatImgContainer">
                  <img className="chatMessageInput" src={URL.createObjectURL(file)} alt="" />
                  <Cancel className="chatCancelImg" onClick={() => setFile(null)} />
                    </div>
                   )}
                {doc && (
                  <div className="chatImgContainer">
                    <img className="chatMessageInput" src={URL.createObjectURL(doc)} alt="" />
                    <Cancel className="chatCancelImg" onClick={() => setDoc(null)} />
                  </div>
                )}
                <div className="chatBoxBottom" >
                 <div className="emoji">
                    <SentimentSatisfiedSharp onClick={handleEmojiPickerhideShow} />
                      {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                  </div>
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    
                  ></textarea>
                  
                  <hr className="chatHr" />
                  <label htmlFor="file" className="chatOption">
                    <Filter  className="chatIcon" />
                      <input
                        style={{ display: "none" }}
                        type="file"
                         id="file"
                         accept=".png,.jpeg,.jpg,.mp4"
                        onChange={(e) => setFile(e.target.files[0])}
                       files={newMessage}
                       />
                  
                  </label>
                  <label htmlFor="doc" className="chatOption">

                    <AttachFile className="chatOption" />
                      <input
                       style={{ display: "none" }}
                       type="doc"
                        id="doc"
                        accept=".pdf,.txt,.dox"
                        onChange={(e) => setDoc(e.target.files[0])}
                       files={newMessage}           
                       />
                     </label>
                  <button className="chatIcon" onClick={ handleSubmit}><SendSharp />
                  
                   
                  </button>
                 
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
        <div className="chatOnlineWrapper">
          <ChatOnline
            onlineUsers={onlineUsers}
            currentId={user._id}
            setCurrentChat={setCurrentChat}
          />
        </div>
      </div>
    </div>
  </>
  
);

 
}



