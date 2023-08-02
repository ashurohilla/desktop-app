import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import html2canvas from 'html2canvas';
import Footer from '../Footer';

const DashboardPage = () => {
  const [isSendingScreenshots, setIsSendingScreenshots] = useState(false);

  const captureScreenshot = () => {
    console.log("hello");
    html2canvas(document.body).then((canvas) => {
      const dataUrl = canvas.toDataURL(); // Get the screenshot as a data URL
      setScreenshot(dataUrl); 
      console.log(dataUrl);// Save the screenshot in the component state
    });
  };


  return (
    <div>
     <Navbar/>
      <h1>Dashboard Page</h1>
      <button >Capture Screenshot</button>
      <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-[300px]"
       
      >
        Start Logging
      </button>
      <div className="mt-4">
        <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-[300px] ">
        <a href="https://www.dianasentinel.com/login">Dashboard</a>
          
        </button>
        <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-[300px]">
          Help
        </button>
        <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-[300px]">
          Settings
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-6 rounded-[400px]"
          onClick={captureScreenshot}
        >
          Stop Logging
        </button>
      </div>
      <Footer/>
    </div>
  
    </div>
  );
};


export default DashboardPage;
