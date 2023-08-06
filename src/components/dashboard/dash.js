import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import logo from "../../assests/images/logo.png";
import Help from "../../assests/images/help.png";
import Setting from "../../assests/images/setting.png";

import logging from "../../assests/images/logingin.png";
import logout from "../../assests/images/logout.png";
import working from "../../assests/images/working.png";
import breakout from "../../assests/images/breakout.png";
import AuthApi from "../../auth/auth";
import { API_SERVER } from "../../config/constant";
import animation from "../../assests/images/bganimation.gif"
function convertDataUrlToPng(dataUrl) {
  // Extract the base64 encoded image data from the Data URL
  const encodedData = dataUrl.split(",")[1];

  // Decode the base64 data
  const decodedData = atob(encodedData);

  // Create a Uint8Array from the decoded data
  const arrayBuffer = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    arrayBuffer[i] = decodedData.charCodeAt(i);
  }

  // Create a Blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: "image/png" });

  // Generate a timestamp for the filename
  const timestamp = Date.now();

  // Create a FormData object and append the blob

  const file = new File([blob], `${timestamp}.png`, { type: "image/png" });

  // Send the FormData to your server or perform any other desired actions
  // ...

  // Return the filename for reference
  return file;
}

const DashboardPage = () => {
  const [isSendingScreenshots, setIsSendingScreenshots] = useState(false);
  const [image, setImage] = useState(logging);
  const [text, settext] = useState("START LOGIN");
  const [textwork, settextwork] = useState("ON WORK");
  const [showGifBackground, setShowGifBackground] = useState(false);


  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [work, setwork] = useState(working);
  const [ color, setcolor] = useState("mainback");
  const [login_time, setlogin_time] = useState(null);
  const [logout_time, setlogout_time] = useState(null);
  const [work_status, setstatus] = useState("working");
  const [error, setError] = useState(undefined);
  const [user, setuser] = localStorage.getItem("id");
  const [date, setDate] = useState(null);
  const [endreport, setFormData] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleLinkClick = () => {
    window.open('https://www.dianasentinel.com/', '_blank');
  };
  const toggleBackground = () => {
    setShowGifBackground(prevState => !prevState);
  };

  useEffect(() => {
    let intervalId = null;

    if (isRecording) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const pad = (value) => (value < 10 ? `0${value}` : value);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };







  const handlework = () => {
    if (work === working) {
      setIsSendingScreenshots(false);
      setIsRecording(false);
      setwork(breakout);
      settextwork(" on break ");
      setcolor("logetout")
      toggleBackground()
      window.electronAPI.sendDataforstop("stop-tasking");
    } else {
      setwork(working);
      setIsSendingScreenshots(true);
      setIsRecording(true);
      settextwork(" on working ");
      setcolor('mainback');
      toggleBackground()
      window.electronAPI.sendDatafortasking("capture-details");
    }
  };

  const handleDataUrl = (dataUrl) => {
    const file = convertDataUrlToPng(dataUrl);
    console.log("Converted file:", file);

    if (file) {
      const id = localStorage.getItem("id");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("organization_id", id);

      axios
        .post(`${API_SERVER}users/screenshots`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Screenshot sent successfully");
          // Handle the response from the backend
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setError("there has been error check your internet connection")
          // Handle the error
        });
    }
  };

  useEffect(() => {
    // Receive data from the main process
    window.electronAPI.receiveDataFromMain((data) => {
      console.log("Received data:", data);
      // Handle the received data
      handleDataUrl(data);
    });
  }, []);

  useEffect(() => {
    // Receive data from the main process
    window.electronAPI.receivescrendata((data) => {
      console.log("screen data:", data);
      // Handle the received data
      screendetails(data);
    });
  }, []);

  const screendetails = async (data) => {
    const screen_count = data.screenswitchcount;
    const screen_name = data.screenname;
    console.log(screen_count, screen_name);
    const orgnisation_id = localStorage.getItem("id");
    console.log("sending screen details");
    try {
      let response = await AuthApi.screendetails({
        screen_count,
        screen_name,
        orgnisation_id,
      });
      if (response.data && response.status === 201) {
        return setError("");
      }
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("something went Wrong");
    }
  };

  const handleCaptureScreenshot = () => {
    window.electronAPI.sendDataToMain("capture-screenshot");
    console.log("sending screenshot");
  };

  const stopSendingScreenshots = () => {
    setIsSendingScreenshots(false);
    setIsRecording(false);
    toggleFormVisibility();
    window.electronAPI.sendDataforstop("stop-tasking");
  };

  const startSendingScreenshots = () => {
    console.log("starting screenshots");
    setIsSendingScreenshots(true);
    window.electronAPI.sendDatafortasking("capture-details");
    
    handletime();
  };


  const handleClick = () => {
    loggingin();
  };




  const loggingin = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("sending login deatils");
    try {
      let response = await AuthApi.Attendance({
        work_status,
        user,
      });
      if (response.data && response.status === 201) {
        if (image === logging) {
          startSendingScreenshots();
          setImage(logout);
          settext("STOP LOGIN");
          setShowImage(true);
        } else {
          settext("START LOGIN");
          stopSendingScreenshots();
        }

        return setError("logged in successfully");
      }
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return setError("Something went wrong");
      }
      return setError("Something went Wrong");
    }
  };

  const loggingout = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("sending logout deatils");
    try {
      let response = await AuthApi.loggingout({
        endreport,
        user,
      });
      console.log(endreport);
      if (response.data && response.status === 201) {
        setFormVisible(false);
        setImage(logging);
        setShowImage(false);
        return setError("succesfully logout");
      }
      console.log(response);
      console.log("logged out");
    } catch (err) {
      console.log(err);
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("something went Wrong");
    }
  };

  const handletime = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  useEffect(() => {
    let intervalId;

    if (isSendingScreenshots) {
      intervalId = setInterval(handleCaptureScreenshot, 5 * 60 * 1000); // Every 5 minutes
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isSendingScreenshots]);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    loggingout();
  };

  return (
    <div className= {` w-full h-full totalwidht ${color}`}>
    {showGifBackground && (
        <img
          src={animation}
          alt="Background"
          className="backimageset w-full h-full fixed z-2  "
        />
      )}
        <Navbar />
        <div className=" maindiv flex  justify-center item-center px-5 images z-40  boxShadow-3xl  ">
          <button className="" onClick={handleClick}>
            <img
              className=" waves flex hover rounded-full w-12 h-12 loginimage  items-center "
              src={image}
              alt=""
            />

            <p className="text-white text-xl">{text}</p>
          </button>
          <button className="" onClick={handlework}>
            <img
              className={`waves flex hover rounded-full w-10 h-10 loginimage items-center ${
                showImage ? "visible" : "hidden"
              }`}
              src={work}
              alt=""
            />

            <p
              className={`textcolor text-xl ${
                showImage ? "visible" : "hidden"
              }`}
            >
              {textwork}
            </p>
          </button>
        </div>
        <div className="textcolor flex justify-center ">
          <p className="textcolor text-3xl">
            Elapsed Time : {formatTime(elapsedTime)}
          </p>
        </div>
        <p className="flex justify-center text-red-500 ">{error}</p>
        <div>
          {isFormVisible && (
            <form onSubmit={handleFormSubmit} className="flex flex-col justify-center items-center">
              <label className="endreportt mt-4  text-xl font-sans font-bold flex flex-col justify-center items-center">
            
                End Report
                <textarea
                placeholder="your day end report"
                  className="inputform rounded"
                  type="textarea"
                  value={endreport}
                  maxLength={100}
                  onChange={(event) => {
                    setFormData(event.target.value);
                  }}
                />
              </label>
             
              <button className="reportbutton " type="submit">
                Submit
              </button>
            </form>
          )}
          
    <div className=" marginfooter footercolor mx-auto flex justify-center items-center gap-6">
    <a  onClick={handleLinkClick} href='#'> <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16  footerimage" src={logo} alt="Logo 1" />
</a>
      <img className="w-16 h-16 sm:w-16 sm:h-16 mr-16 rounded-full  footerimage" src={Help} alt="Logo 2" />
      <img className="w-16 h-16 sm:w-16 sm:h-16  footerimage" src={Setting} alt="Logo 3" />
    </div>
  </div>
        </div>    
  );
};

export default DashboardPage;
