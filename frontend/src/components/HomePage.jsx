import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="w-[70vw] flex flex-col sm:flex-col md:flex-row lg:flex-row h-screen rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20">

      {/* Sidebar */}
      <div className="sm:w-full md:w-[35%] lg:w-[35%] h-1/3 md:h-full overflow-y-auto border-r border-slate-500">
        <Sidebar />
      </div>

      {/* Message Container */}
      <div className="sm:w-full md:w-[65%] lg:w-[65%] h-2/3 md:h-full flex flex-col">
        <MessageContainer />
      </div>

    </div>



  )
}

export default HomePage