const request  = require("https");
const express = require('express');
const socket = require('socket.io');
const http = require("http");
const { ExpressPeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');
const app =express();


const peerServer = ExpressPeerServer(8900, {
  debug: true
});
//app.use('/peerjs', peerServer)

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST']
  },
});


let users = []

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  
};
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ 
      user: userId,
      socketId: socketId })
};
//console.log(users)
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
  users.push({
    user: userId,
    socketId: socketId 
  })
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");
  console.log(socket.id);
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
    io.emit("getUsers", users);
    io.sockets.emit("allUsers", users);

    console.log('addUser')
     console.log(users)
    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: users
    });
  //send and get Notification
  socket.on("sendNotification", ({ senderName, receiverName, type}) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName: users,
      type
    });
  });

  //send and get message
  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const user= getUser(receiverName);
    io.to(user.socketId).emit("getText", {
      senderName,
      text,
      
    });
  });

 });
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    //socket.broadcast.emit("callended")
    removeUser(socket.id);
    io.emit("getUsers", users);
    socket.broadcast.emit('user left',socket.id)
    users = users.filter(user => user.socketId !== socket.id);
    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: users
    });
    console.log("users", users)
  });

  // listeners related with direct call

  socket.on('pre-offer', (data) => {
    console.log('pre-offer handled');
    io.to(data.callee.socketId).emit('pre-offer', {
      callerUsername: data.caller.user,
      callerSocketId: socket.id
    });
   console.log("allerSocketId", allerSocketId)
  });

  socket.on('pre-offer-answer', (data) => {
    console.log('handling pre offer answer');
    io.to(data.callerSocketId).emit('pre-offer-answer', {
      answer: data.answer
    });
    console.log(data)
  });

  socket.on('webRTC-offer', (data) => {
    console.log('handling webRTC offer');
    io.to(data.calleeSocketId).emit('webRTC-offer', {
      offer: data.offer
    });
    console.log(data)
  });

  socket.on('webRTC-answer', (data) => {
    console.log('handling webRTC answer');
    io.to(data.callerSocketId).emit('webRTC-answer', {
      answer: data.answer
    });
  });

  socket.on('webRTC-candidate', (data) => {
    console.log('handling ice candidate');
    io.to(data.connectedUserSocketId).emit('webRTC-candidate', {
      candidate: data.candidate
    });
    console.log(data)
  });

  socket.on('user-hanged-up', (data) => {
    io.to(data.connectedUserSocketId).emit('user-hanged-up');
    console.log(data)
  });
 
});
