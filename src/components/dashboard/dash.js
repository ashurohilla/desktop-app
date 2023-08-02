import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import logging from "../../assests/images/logingin.png";
import logout from "../../assests/images/logout.png";
import working from "../../assests/images/working.png";
import breakout from "../../assests/images/breakout.png";
import AuthApi from "../../auth/auth";
import { API_SERVER } from "../../config/constant";
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

const DashboardPage =  () => {
  const [isSendingScreenshots, setIsSendingScreenshots] = useState(false);
  const [image, setImage] = useState(logging);
  const [text, settext] = useState("Start login");
  const [textwork, settextwork] = useState("on work");

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [work, setwork] = useState(working);
  const [color, setcolor] = useState("mainback");
  const [login_time, setlogin_time] = useState(null);
  const [logout_time, setlogout_time] = useState(null);
  const [work_status, setstatus] = useState("working");
  const [error, setError] = useState(undefined);
  const [user , setuser] = localStorage.getItem("id");
  const [date, setDate] = useState(null);
  const [endreport, setFormData] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [showImage, setShowImage] = useState(false);



  



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

  const handleClick = () => {
    if (image === logging) {
      setImage(logout);
      startSendingScreenshots();
      settext("logged out");
      setShowImage(true);
      
    } else{
     
      settext("Logged in ")
      stopSendingScreenshots();
      
      

    }
    
  };

  const handlework = () => {
    if (work === working) {
      setIsSendingScreenshots(false);
      setIsRecording(false);
      setwork(breakout);
      settextwork(" on break ")
      setcolor("mainback");
      window.electronAPI.sendDataforstop("stop-tasking");

      
      
    } else{
      setwork(working);
      setIsSendingScreenshots(true);
      setIsRecording(true);
      settextwork(" on working ")
      setcolor("loggedout")
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
        .post( `${API_SERVER}users/screenshots`, formData, {
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
      const screen_count = data.screenswitchcount
      const screen_name = data.screenname
      console.log(screen_count, screen_name)
      const orgnisation_id = localStorage.getItem("id");
      console.log("sending screen details")
      try{
  
        let response = await AuthApi.screendetails({   
          screen_count,
          screen_name,
          orgnisation_id,
        }
        );
         if (response.data && response.data.success === true) {
          return setError(response.data.msg);
        }
        console.log(response);
      }
      catch (err) {
        console.log(err);
        if (err.response) {
          return setError(err.response.data.msg);
        }
        return setError("There has been an error.");
      }
    };

  const handleCaptureScreenshot = () => {   
    window.electronAPI.sendDataToMain("capture-screenshot");
    console.log("sending screenshot");
  };

  const stopSendingScreenshots = () => {
    setIsSendingScreenshots(false);
    setIsRecording(false);
    toggleFormVisibility()
    window.electronAPI.sendDataforstop("stop-tasking");

  };

  const startSendingScreenshots = () => {
    
    console.log("starting screenshots")
    setIsSendingScreenshots(true);
    window.electronAPI.sendDatafortasking("capture-details");

    loggingin();
    handletime();
  };


  const  loggingin = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("sending login deatils")
    try{
      let response = await AuthApi.Attendance({  
      work_status,
      user
      }
      );
       if (response.data && response.data.success === true) {
        return setError(response.data.msg);
      }
      console.log(response);
    }
    catch (err) {
      console.log(err);
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("There has been an error.");
    }
  };


  const  loggingout = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("sending login deatils")
    try{
      let response = await AuthApi.loggingout({  
      endreport,
      user
      }
      );
      console.log(endreport);
       if (response.data && response.data.success === true) {
        return setError(response.data.msg);
      }
      console.log(response);
      console.log("logged out");
    }
    catch (err) {
      console.log(err);
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("There has been an error.");
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
      intervalId = setInterval(handleCaptureScreenshot, 1 * 60* 1000); // Every 5 minutes
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
    // Perform any necessary form validation
    // Store the form data in stat
    // Send the form data to the server
    // Hide the form after submission
    
    loggingout();
    setFormVisible(false);
    setImage(logging);
    setShowImage(false);
  };

  return (
    
    <div className={color}  >
     <div >
     <Navbar />

<div className=" flex  justify-center item-center px-5 images  boxShadow-3xl  ">
  <button className="" onClick={handleClick}>
    <img
      className=" waves flex hover rounded-full w-12 h-12 loginimage  items-center "
      src={image}
      alt=""
    />
  
    <p className="text-white">{text}</p>
  </button>
  <button className="" onClick={handlework}>
    <img
        className={`waves flex hover rounded-full w-12 h-12 loginimage items-center ${showImage ? 'visible' : 'hidden'}`}
      src={work}
      alt=""
    />
  
    <p className={`textcolor text-3xl ${showImage ? 'visible' : 'hidden'}`}>{textwork}</p>
  </button>
</div>
<div className="textcolor flex justify-center marginbat">
<p className="textcolor text-3xl">Elapsed Time: {formatTime(elapsedTime)}</p>
</div>
  <div>
      {isFormVisible && (
        <form onSubmit={handleFormSubmit}>
          <label className="endreportt">
            Endreport
            <input className="inputform" type="text" value={endreport}    onChange={(event) => {
            setFormData(event.target.value);
          }} />
          </label>
          <br />
          <br />
          <button className="reportbutton" type="submit">Submit</button>
        </form>
      )}
      <div>
      </div>
    </div>

    <Footer />
     </div>
    
    </div>
    
  );
};

export default DashboardPage;
