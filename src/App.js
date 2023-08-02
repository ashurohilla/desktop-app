import React, { useEffect } from 'react';
// import Dashboard from './components/dashboard/Dashboard';

import Login_page from './Newloginpage';
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from './components/dashboard/dash';
// import Dashboard from './components/dashboard/Newdash';
import "./App.css";

export default function App() {
  const [token, setToken] = React.useState(null);

  useEffect(() => {
    // Check if token exists in local storage
    const storedToken = localStorage.getItem("user");

    setToken(storedToken);

    if (!token) {
      // Token doesn't exist, handle the logic for showing the login page
    }
  }, [token]);

  return (
    <>
      <AuthProvider>

        <div>
          {token ? (
            <DashboardPage />
          ) : (
            <Login_page />
          )}
        </div>
      </AuthProvider>
    </>
  );
}
