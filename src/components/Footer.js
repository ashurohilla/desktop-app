import React from 'react'
import Setting from "../assests/images/setting.png";
import logo from "../assests/images/logo.png";
import Help from "../assests/images/help.png";
const Footer = () => {
  const handleLinkClick = () => {
    window.open('https://www.dianasentinel.com/', '_blank');
  };

  return (
    <div className="  marginfooter footercolor">
    <div className=" mx-auto flex justify-center items-center gap-6">
    <a  onClick={handleLinkClick} href='#'> <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16  footerimage" src={logo} alt="Logo 1" />
</a>
      <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16 rounded-full  footerimage" src={Help} alt="Logo 2" />
      <img className="w-16 h-16 sm:w-16 sm:h-16  footerimage" src={Setting} alt="Logo 3" />
    </div>
  </div>
  )
} 

export default Footer

