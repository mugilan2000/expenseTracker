import Header from '../components/Header'
import Login from '../components/Login'
import Footer from '../components/Footer'

const AuthPage = ({ setAccessToken, theme, toggleTheme, setUserId, setUname }) => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header accessToken={null} theme={theme} toggleTheme={toggleTheme} />
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