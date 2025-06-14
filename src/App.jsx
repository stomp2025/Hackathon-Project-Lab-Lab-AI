import React, { useState } from "react";
import Login from './componenets/login';
import AthleteDashboard from './componenets/atheletedashboard';
import CoachDashboard from './componenets/coachdashboard';
import Register from './componenets/register'; // <-- New

const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  // Handle login and route to dashboards
  const handleLogin = (role, name) => {
    setUserRole(role);
    setUserName(name);
    setCurrentView(role === "athlete" ? "athlete-dashboard" : "coach-dashboard");
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentView("login");
    setUserRole("");
    setUserName("");
  };

  // Handle go to register
  const goToRegister = () => setCurrentView("register");

  // Handle successful registration (return to login)
  const handleRegisterSuccess = () => setCurrentView("login");

  return (
    <div className="font-sans min-h-screen bg-black">
      {currentView === "login" && (
        <Login
          onLogin={handleLogin}
          onGoToRegister={goToRegister}
        />
      )}
      {currentView === "athlete-dashboard" && (
        <AthleteDashboard onLogout={handleLogout} name={userName} />
      )}
      {currentView === "coach-dashboard" && (
        <CoachDashboard onLogout={handleLogout} name={userName} />
      )}
      {currentView === "register" && (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
};

export default App;