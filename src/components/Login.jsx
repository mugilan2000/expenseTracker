import React, { useEffect } from "react";
import { login, register } from "../api/expenseTrackerAPI";
import { jwtDecode } from "jwt-decode";

const Login = ({ setAccessToken, setUserId, setUname }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [message, setMessage] = React.useState("");

  const isLoginScreen = (value) => {
    setIsLogin(value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
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
    setIsLogin(true);
    setAccessToken("dummyAccessToken");
    localStorage.setItem("accessToken", "dummyAccessToken");
    // try {
    //   setMessage("Validating User...");
    //   const payload = {
    //     email: loginEmail,
    //     password: loginPassword,
    //   };
    //   const response = await login(payload);
      
    //   if (response.length > 25) {
    //     const decoded = jwtDecode(response);
    //     setAccessToken(response);
    //     localStorage.setItem("accessToken", response);
    //     setUserId(decoded.userId);
    //     localStorage.setItem("userId", decoded.userId);
    //     setUname(decoded.username);
    //     localStorage.setItem("username", decoded.username);
    //   }
    //   else{
    //     setMessage("Invalid Username or Password");
    //   }
    // } catch (error) {
    //   setMessage("Invalid Username or Password");
    // }
  };

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
