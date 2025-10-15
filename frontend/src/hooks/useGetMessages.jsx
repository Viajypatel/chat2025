import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import axios from 'axios';
//import { BASE_URL } from '..';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                 const token = localStorage.getItem('token');
                axios.defaults.withCredentials = true;
                const res = await axios.get(`http://127.0.0.1:8080/api/v1/message/${selectedUser?._id}`
                    ,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                dispatch(setMessages(res.data))
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [selectedUser?._id, setMessages]);
}

export default useGetMessages