import  { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import axios from 'axios';
//import { BASE_URL } from '..';
const API_URL = import.meta.env.VITE_API_URL|| "http://localhost:8080";
const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const res = await axios.get(`${API_URL}/api/v1/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // send token in header
                    },
                    withCredentials: true // optional, depending on your backend
                });
                const payload = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];
                console.log("other users -> ", res);
                dispatch(setOtherUsers(payload));
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
    }, [dispatch])

}

export default useGetOtherUsers