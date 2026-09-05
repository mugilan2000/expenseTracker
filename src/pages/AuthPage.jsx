import React from 'react'
import Header from '../components/Header'
import Login from '../components/Login'
import Footer from '../components/Footer'

const AuthPage = ({ setAccessToken, accessToken, theme, toggleTheme, setUserId, setUname, isThemeSwitching }) => {
  return (
    <div className={`theme-shell ${isThemeSwitching ? "theme-switching" : ""}`}>
            <div className={`theme-overlay ${isThemeSwitching ? "active" : ""}`} />
            <Header
              accessToken={accessToken}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <Login
              setAccessToken={setAccessToken}
              setUserId={setUserId}
              setUname={setUname}
            />
            <Footer />
          </div>
  )
}

export default AuthPage