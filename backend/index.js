const express = require("express");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./Routes/userR");
const chatRoutes = require("./Routes/chatR");
const messageRoutes = require("./Routes/messageR");

dotenv.config();
connectDB();

const app = express();

// const httpServer = createServer(app);

app.use(cors());
app.use(express.json()); //to accept json data

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const httpServer = app.listen(process.env.PORT || 6000, () => {
  console.log("server is listning on port");
});

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

//creating connection
io.on("connection", (socket) => {
  // console.log("connect to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join room",(room)=>{
     socket.join(room);
      // console.log("user joined room :" + room);
  });

  socket.on("new message", (newMessageRec)=>{
     let chat = newMessageRec.chat;

     if (!chat.users) return console.log("chat.users not defined");

     chat.users.forEach((user) => {
       if (user._id == newMessageRec.sender._id) return;

       socket.in(user._id).emit("message recieved", newMessageRec);
     });
  })
});
