import React, { useEffect } from "react";
import { login, register } from "../api/expenseTrackerAPI";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import googleLogo from "../assets/Google_Favicon_2025.svg";
import "../App.css";

const Login = ({ setAccessToken, setUserId, setUname }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [message, setMessage] = React.useState("");

  const navigate = useNavigate();

  const isLoginScreen = (value) => {
    setIsLogin(value);
    setMessage("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if(username === "" || email === "" || password === ""){
      setMessage("Please fill in all fields");
      return;
    }
    const payload = {
      username: username,
      email: email,
      password: password,
    };
    const response = await register(payload);
    console.log(response);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if(loginEmail === ""){
      setMessage("Please enter your email");
      return;
    }
    if(loginPassword === ""){
      setMessage("Please enter your password");
      return;
    }

    // localStorage.setItem("accessToken", "dummyAccessToken");
    try {
      setMessage("Validating User...");
      const payload = {
        email: loginEmail,
        password: loginPassword,
      };
      const response = await login(payload);
      
      if (response.token) {
        
        setAccessToken(response.token);
        setUserId(response.userId);
        setUname(response.username);
        setMessage(response.message);

        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("username", response.username);

        navigate("/");
      }
      else{
        setMessage("Invalid Username or Password");
      }
    } catch (error) {
      setMessage("Invalid Username or Password");
    }
  };

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  return (
    <>
      {isLogin ? (
        <div className="login-container">
          <h1>Login</h1>
          <div className="response-area">
            <span>{message}</span>
          </div>
          <form className="login-form">
            <input
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit" onClick={(e) => handleLogin(e)}>
              Login
            </button>
            <span className="or-separator" style={{ textAlign: "center" }}>
              OR
            </span>
            <button className="google-login-btn" onClick={(e) => handleGoogleLogin(e)}>
              <span>Login with</span> <img src={googleLogo} alt="Google Logo" />
            </button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => isLoginScreen(false)}
                className="sign-up-button"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <h1>Sign Up</h1>
          <div className="response-area">
            <span>{message}</span>
          </div>
          <form className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={(e) => handleRegister(e)}>
              Sign Up
            </button>
          </form>
          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <span
                onClick={() => isLoginScreen(true)}
                className="sign-up-button"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
