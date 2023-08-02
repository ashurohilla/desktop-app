import React, { useState, useEffect } from "react";
import axios from "axios";
const Dashboard = () => {
  const [isSendingScreenshots, setIsSendingScreenshots] = useState(false);

  const captureAndSendScreenshot = async () => {
    try {
      const sources = await window.navigator.mediaDevices.enumerateDevices();
      const screenSource = sources.find(source => source.name === 'screen');

      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(videoTrack);

      const blob = await imageCapture.grabFrame();
      const file = new File([blob], 'screenshot.png', { type: 'image/png' });
      if (file) {
        const id = localStorage.getItem("id");
        const formData = new FormData();
        formData.append("image", file);
        formData.append("organization_id", id);

        axios
          .post("http://127.0.0.1:8001/api/users/imageupload", formData, {
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

      // Send the file to your API using Axios or Fetch
      // axios.post('/api/screenshot', file);
      // or
      // fetch('/api/screenshot', { method: 'POST', body: file });

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error capturing and sending screenshot:', error);
    }
  };

  const startSendingScreenshots = () => {
    setIsSendingScreenshots(true);
  };

  const stopSendingScreenshots = () => {
    setIsSendingScreenshots(false);
  };

  useEffect(() => {
    let intervalId;

    if (isSendingScreenshots) {
      intervalId = setInterval(captureAndSendScreenshot, 5 * 10 * 100); // Every 5 minutes
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isSendingScreenshots]);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={startSendingScreenshots}>Start Sending Screenshots</button>
      <button onClick={stopSendingScreenshots}>Stop Sending Screenshots</button>
    </div>
  );
};

export default Dashboard;









































// const Dashboard = () => {
//   const [isSendingScreenshots, setIsSendingScreenshots] = useState(false);

//   const captureAndSendScreenshot = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: false,
//       });

//       const videoTrack = stream.getVideoTracks()[0];
//       const imageCapture = new ImageCapture(videoTrack);

//       const bitmap = await imageCapture.grabFrame();
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = bitmap.width;
//       canvas.height = bitmap.height;
//       context.drawImage(bitmap, 0, 0);
//       const dataUrl = canvas.toDataURL();

//       const file = dataURLtoFile(dataUrl, "screenshot.png");

//       if (file) {
//         const id = localStorage.getItem("id");
//         const formData = new FormData();
//         formData.append("image", file);
//         formData.append("organization_id", id);

//         axios
//           .post("http://127.0.0.1:8001/api/users/imageupload", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Screenshot sent successfully");
//             // Handle the response from the backend
//           })
//           .catch((error) => {
//             console.error("Error uploading image:", error);
//             // Handle the error
//           });
//       }

//       stream.getTracks().forEach((track) => track.stop());
//     } catch (error) {
//       console.error("Error capturing and sending screenshot:", error);
//     }
//   };

//   const startSendingScreenshots = () => {
//     setIsSendingScreenshots(true);
//   };

//   const stopSendingScreenshots = () => {
//     setIsSendingScreenshots(false);
//   };

//   useEffect(() => {
//     let intervalId;

//     if (isSendingScreenshots) {
//       intervalId = setInterval(captureAndSendScreenshot, 5 * 10 * 100); // Every 5 minutes
//     } else {
//       clearInterval(intervalId);
//     }

//     return () => clearInterval(intervalId);
//   }, [isSendingScreenshots]);

//   const dataURLtoFile = (dataUrl, filename) => {
//     const arr = dataUrl.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   };

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <button onClick={startSendingScreenshots}>
//         Start Sending Screenshots
//       </button>
//       <button onClick={stopSendingScreenshots}>Stop Sending Screenshots</button>
//     </div>
//   );
// };

// export default Dashboard;
