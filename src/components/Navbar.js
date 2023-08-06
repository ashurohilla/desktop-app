import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assests/images/logo.png'
import Dropdown from './dropdown/index'


function Navbar() {
  const username = localStorage.getItem('name');
  const { setUser, setId, setToken } = useAuth(); // Assuming you have a custom hook named useAuth

  const handleLogout = async () => {
    await setUser(null);
    await setId(null);
    await setToken(null);
    localStorage.clear();
    window.location.reload();
  }; // Empty dependency array to run the effect only once on component mount

  return (
    <nav className=" navigationbar top-2 text-xl flex w-full items-center   justify-between  z-20">
    <div className='flex item-center'>

   
    <img src={logo} alt="Daina sentinel" className=" flex w-[60px] h-auto py-2 pl-2 " />
    <p className=" flex text-newbuttoncolor ">iana</p>
    </div>

    <div className="flex postiondiv  float-right flex-1 mr-2">
      <li className=" flex flex-col">
      <p className='mr-2 text-white'>{username}</p>
        {username ? (
          <p
            className= "text-red-600 logoutbutton font-sans text-md transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </p>
        ) : (
          <a href=""></a>
        )}
      </li>
      </div>
      
      
   
  </nav>
  );
}
 
export default Navbar;
