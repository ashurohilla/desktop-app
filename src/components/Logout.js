import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

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

export default LogOut;
