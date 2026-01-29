import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import "./Footer.js"
import { login } from "./Apis/api";
import Footer from "./Footer";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const username = loginDetails.username;
  const password = loginDetails.password;
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Validating Credentials");
    setLoading(false);
  }, []);

  const handleReset = () => {
    setLoginDetails({
      username: "",
      password: "",
    });
    setError("");
  };

  const ValidateFields = () => {
    if (username.trim() === "") toast.error("username is mandatory");
    if (password.trim() === "") toast.error("Password is mandatory");

    if (username.trim() === "" || password.trim() === "") return false;
    return true;
  };

  const handleChange = (event, field) => {
    let actualValue = event.target.value;
    setLoginDetails({
      ...loginDetails,
      [field]: actualValue,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    if (ValidateFields()) {
      setLoading((value) => !value);

      // Temporary local authentication for testing (hardcoded).
      // Accepts username: 'admin' and password: 'admin'.
      const isLocalValid =
        loginDetails.username === "admin" && loginDetails.password === "admin";

      /*
      // Original API call (commented out for testing). Uncomment to restore.
      try {
        const loginStatus = await login(
          loginDetails.username,
          loginDetails.password
        );
        if (loginStatus) {
          console.log("login successfull");
          setLoading((value) => !value);
          setLoginDetails({
            username: "",
            password: "",
          });
          onLogin();
        } else {
          setLoading((value) => !value);
          toast.error("Invalid Credentials");
        }
      } catch (error) {
        setLoading((value) => !value);
        toast.error("Network error!!!");
      }
      */

      if (isLocalValid) {
        console.log("login successful (local)");
        setLoading((value) => !value);
        setLoginDetails({ username: "", password: "" });
        onLogin();
      } else {
        setLoading((value) => !value);
        toast.error("Invalid Credentials");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Login in progress...</p>
        </div>
      )}
      <div className="login-bg">
        <div className="login-card">
          <h2 className="login-title">File Upload App</h2>
          <p className="login-subtitle">Please sign in to your account</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                id="username"
                placeholder="Enter your username"
                value={loginDetails.username}
                onChange={(e) => handleChange(e, "username")}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={loginDetails.password}
                onChange={(e) => handleChange(e, "password")}
                required
                disabled={loading}
              />
            </div>

            <div className="login-actions">
              <button className="btn-login" type="submit" disabled={loading}>
                Sign In
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="login-footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Login;
