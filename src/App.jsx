import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import ExpenseList from "./components/ExpenseList";
import SideBar from "./components/SideBar";
import { getData } from "./api/expenseTrackerAPI";
import Login from "./components/Login";
import Footer from "./components/Footer";
import { registerSW } from "virtual:pwa-register";
import {
  filterTransactionsByPeriod,
  REPORTING_PERIODS,
} from "./utils/transactionFilters";

registerSW({ immediate: true });

function App() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedDataView, setSelectedDataView] = useState(
    REPORTING_PERIODS.OVERALL,
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null,
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [uname, setUname] = useState(localStorage.getItem("username") || null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [isThemeSwitching, setIsThemeSwitching] = useState(false);
  const themeTimeoutRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (themeTimeoutRef.current) {
      clearTimeout(themeTimeoutRef.current);
    }

    setIsThemeSwitching(true);
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));

    themeTimeoutRef.current = setTimeout(() => {
      setIsThemeSwitching(false);
    }, 320);
  };

  const refreshData = async (force = false) => {
    const storedTransactions = localStorage.getItem("transactions");
    let existingData = null;

    if (storedTransactions) {
      try {
        existingData = JSON.parse(storedTransactions);
      } catch (error) {
        console.error("Failed to parse cached transactions:", error);
      }
    }

    if (!force && existingData && existingData.length > 0) {
      setAllTransactions(existingData);
      return existingData;
    }

    const data = await getData();
    localStorage.setItem("transactions", JSON.stringify(data));
    setAllTransactions(data);
    return data;
  };

  useEffect(() => {
    refreshData();
  }, [accessToken]);

  const reportingTransactions = filterTransactionsByPeriod(
    allTransactions,
    selectedDataView,
  );

  useEffect(() => {
    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {!accessToken && (
        <>
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
        </>
      )}
      {accessToken && (
        <>
          <div className={`app ${isThemeSwitching ? "theme-switching" : ""}`}>
            <div className={`theme-overlay ${isThemeSwitching ? "active" : ""}`} />
            <Header
              allTransactions={allTransactions}
              accessToken={accessToken}
              theme={theme}
              toggleTheme={toggleTheme}
              selectedDataView={selectedDataView}
              setSelectedDataView={setSelectedDataView}
            />
            <main>
              <Dashboard allTransactions={reportingTransactions} />
              <div className="content-grid">
                <div>
                  <AddTransaction
                    allTransactions={allTransactions}
                    refreshData={refreshData}
                  />
                  <ExpenseList
                    allTransactions={reportingTransactions}
                    refreshData={refreshData}
                  />
                </div>
                <SideBar
                  allTransactions={allTransactions}
                  reportingTransactions={reportingTransactions}
                />
              </div>
            </main>
            <Footer />
          </div>
          <div id="toast"></div>
        </>
      )}
    </>
  );
}

export default App;
