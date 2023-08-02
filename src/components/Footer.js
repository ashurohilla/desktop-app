import React from 'react'
import Setting from "../assests/images/setting.png";
import logo from "../assests/images/logo.png";
import Help from "../assests/images/help.png";
const Footer = () => {
  return (
    <footer className=" py-4 marginfooter footercolor">
    <div className=" mx-auto flex justify-center items-center gap-6">
      <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16 rounded-full footerimage" src={logo} alt="Logo 1" />
      <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16 rounded-full footerimage" src={Help} alt="Logo 2" />
      <img className="w-16 h-16 sm:w-16 sm:h-16 rounded-full footerimage" src={Setting} alt="Logo 3" />
    </div>
  </footer>
  )
} 

export default Footer

