import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import AuthApi from "./auth/auth";
import Navbar from "./components/Navbar";
import InputField from "./components/fields/InputField";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Particle from "./components/particle";
function Login_page() {
  const navigate = useNavigate();
  let { user } = useAuth;
  const { setUser } = useAuth();
  const { id } = useAuth();
  const { setId } = useAuth();
  const { token } = useAuth();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [buttonText, setButtonText] = useState("Sign in");
  // const [registrationType, setRegistrationType] = useState("employee");

  const login = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (user && user.token) {
      return setError("navigating login page");
    }
    if (email === "") {
      return setError("You must enter your email.");
    }
    if (password === "") {
      return setError("You must enter your password");
    }
    setButtonText("Signing in");
    try {
      let response = await AuthApi.Login({
        email,
        password,
      });
      if (response.data && response.data.success === true) {
        return setError(response.data.msg);
      }
      console.log(response);
      return setProfile(response);
    } catch (err) {
      console.log(err);
      setButtonText("Sign in");
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("There has been an error.");
    }
  };
  const handleLinkClick = () => {
    window.open('https://www.dianasentinel.com/', '_blank');
  };


  const setProfile = async (response) => {
    console.log(response);
    let user = { ...response.data.user };
    var token = response.data.access;
    var decode = jwtDecode(token);
    let id = decode.user_id;
    let name = decode.name;
    user = JSON.stringify(user);
    localStorage.setItem("user", user);
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    setUser(user);
    setId(id);
    setToken(token);
    window.location.reload();
  };
  return (
    <div className=" loginnew ">
    <Particle/>
      <Navbar />
      <div className=" heading  text-white text-3xl mx-auto justify-center  flex h-fit w-fit items-center hover:cursor-pointer hover:text-blue-800">
              Diana Employe Monitoring software
      </div>

      <div className="flex justify-center mt-8">
      <button className=" signinbutton mt-2 flex  border rounded-2xl py-2 ">
              <h4 className=" flex text-2xl  justify-center font-bold px-2 text-white">
                Sign in
              </h4>
            </button>

      </div>
      <div className=" mt-8  flex justify-center items-center md:pl-4 lg:pl-0 ">
            
            {/* Email */}
            <form method="submit">
              <InputField
                style={{ color: "white"}}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(undefined);
                }}
                autoComplete="mail"
                name="email"
                variant="auth"
                extra="mb-3 imputWidth "
                label="Email*"
                placeholder="Enter your Email"
                id="Email"
                type="email"
                value={email}
                className="input"
              />

              <InputField
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(undefined);
                }}
                variant="auth"
                name="password"
                extra="mb-3 imputWidth "
                label="Password*"
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
              />

              {/* Checkbox */}
              <div className=" flex items-center justify-between py-2 px-2">
                <div className="flex items-center">
                <input type="checkbox" />
                  <p className="ml-2 text-sm font-medium text-white">
                    Keep me logged In
                  </p>
                </div>
                <a
                  className="text-sm font-medium text-buttoncolor hover:text-blue-600 dark:text-white"
                  href=" "
                >
                  Forgot Password?
                </a>
                
              </div>

              <div className="widthbutton">
            <button
                type="Submit"
                onClick={login}
                className=" mt-4  buttonsize flex items-center    justify-center rounded-xl  py-[12px]  font-medium text-white buttoncolor"
              >
                {buttonText}
              </button>


              
              
            </div>
            <h1 className="text-red-500 flex justify-left float-left mt-4  ">{error}</h1>
            </form>
           
          
           
            </div>

            <footer>
              <h1 className="float-right text-white pt-10 mx-2 linked">
              <a   onClick={handleLinkClick} href='#'>  
              www.dianasentinel.com

              </a>

              </h1>
            </footer>
           
    </div>
  );
}

export default Login_page;
