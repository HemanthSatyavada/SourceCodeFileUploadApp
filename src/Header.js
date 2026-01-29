import React from "react";
import { Title } from "./Login.style";
import "./Login.css";
import logo from "./logo/Taylor_and_Francis.svg.png";
import { logout } from "./Apis/api";
import logouticon from "./logo/logout-4.png";

const Header = ({ isLoggedIn, onLogout }) => {
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      onLogout();
    }
  };

  return (
    <Title>
      <table>
        <tbody>
          <tr>
            <td>
              <img src={logo} width="70px" alt="T&F Logo" /> {"   "}
              <span className="main-title">File Upload App</span>
            </td>
            <td>
              {isLoggedIn ? (
                <>
                  <a
                    className="logout-button"
                    onClickCapture={handleLogout}
                    href="/#"
                  >
                    {" "}
                    <img src={logouticon} width="90px" alt="Logout"></img>
                  </a>
                </>
              ) : (
                <button onClick={handleLogout} hidden="hidden">
                  Logout
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </Title>
  );
};

export default Header;
