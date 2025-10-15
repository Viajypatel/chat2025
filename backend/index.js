// const express = require('express')// method-1
import express from "express"; // method-2
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./socket/socket.js";
dotenv.config({});

app.use(cors({
    origin: ['http://localhost:5175','http://137.97.126.110:5173','http://137.97.126.110:5175','http://localhost:5173'],
    credentials: true, 
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  }));
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello from the Server");
})
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);
 

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});

