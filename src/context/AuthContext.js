import React from "react";
import PropTypes from "prop-types";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ userData, children }) => {
  
   
  let [user, setUser] = React.useState(userData);
  let [id, setId]= React.useState(userData); 
  let [token, setToken]= React.useState(userData);
  let [type, setType ] =React.useState(userData);

  // user = typeof user === "string" ? JSON.parse(user) : user;



  function LogOut() {
    const { setUser, setToken, setId } = useAuth();

  const handleLogout = async () => {
    await setUser(null);
    await setId(null);
    await setToken(null);
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  // Render null or placeholder content
  return null;
}

 
  return <AuthContext.Provider value={{ user, setUser, id, setId, token, setToken , type , setType ,LogOut}}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};
export const useAuth = () => React.useContext(AuthContext);
    
