import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { setSocket } from "../redux/socketSlice";

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socket);
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            if (socket) socket.disconnect();
            dispatch(setSocket(null));
 
            navigate("/login");
            toast.success("You have logged out successfully!👋");

            // clear token-based auth on logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            delete axios.defaults.headers.common['Authorization'];
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }
    const searchSubmitHandler = (e) => {
        e.preventDefault();

        if (!search.trim()) {
            // If input is empty, show all users
            dispatch(setOtherUsers(otherUsers)); // assuming otherUsers holds the full list somewhere
            return;
        }
        const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
        } else {
            toast.error("User not found!");
        }
    }
    return (
        <div className='border-r border-slate-500 p-4 flex flex-col h-full'>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input input-bordered rounded-md' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn bg-zinc-700 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none' />
                </button>
            </form>
            <div className="divider px-3"></div>
            <OtherUsers />
            {/* <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
            </div> */}
            <div className='flex items-center justify-between mt-4 p-2 bg-gray-600 rounded-md'>
                {/* Logout Button */}
                <button onClick={logoutHandler} className='btn btn-sm bg-red-600 hover:bg-red-700 text-white'>
                    Logout
                </button>

                {/* Profile */}
                <div className='flex items-center gap-3'>
                    <span className='text-white font-medium'>
                        {useSelector(state => state.user.authUser?.fullName || "User")}
                    </span>
                    <img
                        src={useSelector(state => state.user.authUser?.profilePhoto || "/default-avatar.png")}
                        alt="Profile"
                        className='w-10 h-10 rounded-full object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default Sidebar