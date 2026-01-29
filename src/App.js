import React, { useState } from "react";
import "./App.css";
import Login from "./Login";
import Tabs from "./Components/Tabs";
import Header from "./Header";
import Footer from "./Footer";
import { USER_DETAILS } from "./Utils/Constants";
import { getExpiryTime } from "./Apis/api";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {

      let time = getExpiryTime();
      let isExpire = Math.round(new Date().getTime()) < time;
      if(!isExpire){
        localStorage.removeItem(USER_DETAILS);
        return false;
      }else{
        return true;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  });


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_DETAILS);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="app-main">
        {isLoggedIn ? (
          <Tabs onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
