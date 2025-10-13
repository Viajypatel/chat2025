import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

// ✅ Maintain mapping between userId and socketId
const userSocketMap = {}; // { userId: socketId }

// ✅ Helper function to get receiver socket ID
export const getReceiverSocketId = (receiverId) => {
  console.log("The receiverId is:", receiverId);
  return userSocketMap[receiverId];
};

// ✅ Initialize Socket.IO server with CORS setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Handle connections
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("User ID from client:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // 🟢 Emit updated online users list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 🛑 On disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
