import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assests/images/logo.png'
import Dropdown from './dropdown/index'


function Navbar() {
  const user = localStorage.getItem('user');
  const { setUser, setId, setToken } = useAuth(); // Assuming you have a custom hook named useAuth

  const handleLogout = async () => {
    await setUser(null);
    await setId(null);
    await setToken(null);
    localStorage.clear();
    window.location.reload();
  }; // Empty dependency array to run the effect only once on component mount

  return (
    <nav className="top-2 z-40 flex flex-row flex-wrap items-center justify-between navbarcolor">
      <img src={logo} alt="Daina sentinel" className="w-[60px] h-[px] text-black rounded-[100px]" />
      <ul className="list-none sm:flex justify-center items-center flex-1">
        <span> </span>
        <li className="font-poppins font-normal cursor-pointer text-4xl flex  text-white float-right  hover:marker px-5 py-5 ">
          {user ? (
            <button onClick={handleLogout}>logout</button>
          ) : (
            <a href="">Login</a>
          )}
        </li>
     
        <span> </span>
      </ul>
      <button className='h-16 w-10 rounded-full buttoncolor'>
    <li className=" list-none  font-poppins font-normal cursor-pointer text-black px-2 py-2 float-right mx-5 text-xl">
          <Link to="/">Diana</Link>
        </li>
      </button>
    </nav>
  );
}
 
export default Navbar;
