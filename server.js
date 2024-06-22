const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { createServer } = require("http"); // Import createServer to create a server for socket.io
const { Server } = require("socket.io"); // Import Server from socket.io

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

//create a PORT
const PORT = process.env.PORT || 8080;

// Routes
app.use("/", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send("<h1>Sorry! Page not found on the server <h1/>");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Create HTTP server and integrate Socket.io
const server = createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected");
  //coustome socket's
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected", true);
  });
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Server
server.listen(
  process.env.PORT,
  console.log(chalk.blue.bold("PORT is running on " + `${PORT}`))
);
