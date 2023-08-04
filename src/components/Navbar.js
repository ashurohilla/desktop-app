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
    <nav className="top-2 text-xl flex flex-row flex-wrap items-center justify-between bg-black">
      <img src={logo} alt="Daina sentinel" className="w-[60px]  text-black " />
      <ul className="list-none sm:flex justify-center items-center flex-1">
        <span> </span>
        <li className='flex px-4 py-2   rounded-full hover:bg-blue-700  text-white navtext font-sans text-xl border border-white transition-colors duration-200'>
          {user ? (
            <button  onClick={handleLogout}>Logout</button>
          ) : (
            <a href="">Login</a>
          )}
        </li>
     
        <span> </span>
      </ul>
      <button className=' dianabtn'>
    <li className=" dianabtn flex border border-white px-4 py-2   rounded-full hover:bg-blue-700 navtext text-white font-sans text-xl  transition-colors duration-200">
          <Link to="www.dianasentinel.com">Diana</Link>
        </li>
      </button>
    </nav>
  );
}
 
export default Navbar;
