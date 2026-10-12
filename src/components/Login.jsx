import { useState } from "react";
import { login, register } from "../api/expenseTrackerAPI";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/Google_Favicon_2025.svg";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const Login = ({ setAccessToken, setUserId, setUname }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const response = await register(payload);
      console.log(response);
    } finally {
      setIsSubmitting(false);
    }
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
      setIsSubmitting(true);
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
    } catch {
      setMessage("Invalid Username or Password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (event) => {
    event.preventDefault();

    if (Capacitor.isNativePlatform()) {
        await Browser.open({
            url: "https://api.exptracker.in/api/auth/google-mobile"
        });
    } else {
        window.location.href =
            "https://api.exptracker.in/oauth2/authorization/google";
    }
};

  return (
    <>
      {isLogin ? (
        <section className="flex min-h-[calc(100dvh-118px)] flex-col items-center justify-center gap-4 bg-surface px-4 py-8 text-text">
          <h1 className="font-brand text-3xl">Login</h1>
          <div className="min-h-5 text-center text-sm text-text2" aria-live="polite">
            <span>{message}</span>
          </div>
          <form className="flex w-full max-w-[360px] flex-col gap-4 rounded-card border border-border bg-surface2 p-6 shadow-lg" onSubmit={handleLogin}>
            <input
              className="rounded-control border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              type="text"
              autoComplete="email"
              aria-label="Email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              className="rounded-control border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="rounded-control bg-accent px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Validating..." : "Login"}
            </button>
            <span className="text-center text-sm text-text3">
              OR
            </span>
            <button className="flex h-[45px] w-full items-center justify-center gap-1.5 rounded-control border border-border bg-surface text-sm text-text hover:bg-surface3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" type="button" onClick={(e) => handleGoogleLogin(e)}>
              <span>Login with</span> <img className="size-5 object-contain" src={googleLogo} alt="Google Logo" />
            </button>
          </form>
          <div className="text-center text-sm text-text2">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => isLoginScreen(false)}
                className="text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Sign up
              </button>
            </p>
          </div>
        </section>
      ) : (
        <section className="flex min-h-[calc(100dvh-118px)] flex-col items-center justify-center gap-4 bg-surface px-4 py-8 text-text">
          <h1 className="font-brand text-3xl">Sign Up</h1>
          <div className="min-h-5 text-center text-sm text-text2" aria-live="polite">
            <span>{message}</span>
          </div>
          <form className="flex w-full max-w-[360px] flex-col gap-4 rounded-card border border-border bg-surface2 p-6 shadow-lg" onSubmit={handleRegister}>
            <input
              className="rounded-control border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              type="text"
              autoComplete="username"
              aria-label="Username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="rounded-control border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              type="email"
              autoComplete="email"
              aria-label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="rounded-control border border-border bg-surface2 px-3.5 py-2.5 text-sm text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              type="password"
              autoComplete="new-password"
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="rounded-control bg-accent px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <div className="text-center text-sm text-text2">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => isLoginScreen(true)}
                className="text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Login
              </button>
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
