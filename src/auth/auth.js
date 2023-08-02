import axios from "./index";

class AuthApi {
  static Login = (data) => {
    return axios.post(`/token/`, data);
  };

  static Register = (data) => {
    return axios.post(`${base}/register`, data);
  };

  static Logout = (data) => {
    return axios.post(`${base}/logout`);
    
  };

static Attendance = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${base}/attendance`, data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
static loggingout = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${base}/loggingout`, data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
static screendetails = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${base}/monitorscreen`, data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
}



let base = "users";

export default AuthApi;