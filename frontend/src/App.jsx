import Signup from './components/Signup';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import AuthLayout from './layouts/AuthLayout';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
//import { BASE_URL } from '.';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    element: <AuthLayout />,  // 👈 Apply layout for auth pages
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ]
  }
]);

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();
  console.log('authUser in App:', authUser);
  useEffect(()=>{
    if(authUser){
      console.log('Attempting Socket.IO connection to http://localhost:8080 with userId:', authUser._id);
      const socketio = io(SOCKET_URL, {
          query:{
            userId:authUser._id
          }
      });
      dispatch(setSocket(socketio));

      socketio.on('connect', () => {
        console.log('Socket connected:', socketio.id);
      });
      socketio.on('connect_error', (err) => {
        console.error('Socket connect_error:', err?.message || err);
      });
      socketio.on('error', (err) => {
        console.error('Socket error:', err);
      });
      socketio.on('getOnlineUsers', (onlineUsers)=>{
        console.log('onlineUsers event:', onlineUsers);
        dispatch(setOnlineUsers(onlineUsers))
      });
       return () => {
      socketio.disconnect();
    };
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }

  },[authUser]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router}/>
    </div>

  );
}

export default App;
