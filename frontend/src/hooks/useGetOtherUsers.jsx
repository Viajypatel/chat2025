import  { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import axios from 'axios';
//import { BASE_URL } from '..';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const res = await axios.get(`http://127.0.0.1:8080/api/v1/user`, {
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