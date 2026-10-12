import { useEffect, useState } from "react";
import { getData } from "./api/expenseTrackerAPI";
import { registerSW } from "virtual:pwa-register";
import {
  filterTransactionsByPeriod,
  REPORTING_PERIODS,
} from "./utils/transactionFilters";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import ProtectedRoute from "./utils/ProtectedRoute";
import OAuthSuccess from "./utils/OAuthSuccess";
import AuthPage from "./pages/AuthPage";
import { App as CapacitorApp } from "@capacitor/app";

registerSW({ immediate: true });

function App() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedDataView, setSelectedDataView] = useState(
    REPORTING_PERIODS.OVERALL,
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null,
  );
  const [, setUserId] = useState(localStorage.getItem("userId") || null);
  const [, setUname] = useState(localStorage.getItem("username") || null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
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
    if (!accessToken) return;

    refreshData();
  }, [accessToken]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      await CapacitorApp.addListener("appUrlOpen", ({ url }) => {
        console.log("OAuth callback URL:", url);

        if (url.startsWith("com.exptracker.app://oauth2redirect")) {
          const urlObject = new URL(url);
          const token = urlObject.searchParams.get("token");
          const username = urlObject.searchParams.get("username");

          if (token) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("username", username || "");
            console.log("Google login successful");
            window.location.href = "/";
          }
        }
      });
    };

    handleOAuthCallback();

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    let listener;

    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    }).then((result) => {
      listener = result;
    });

    return () => {
      listener?.remove();
    };
  }, []);

  const reportingTransactions = filterTransactionsByPeriod(
    allTransactions,
    selectedDataView,
  );

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
      <Routes>
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/login"
          element={
            <AuthPage
              setAccessToken={setAccessToken}
              theme={theme}
              toggleTheme={toggleTheme}
              setUserId={setUserId}
              setUname={setUname}
            />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main
                allTransactions={allTransactions}
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                theme={theme}
                toggleTheme={toggleTheme}
                selectedDataView={selectedDataView}
                setSelectedDataView={setSelectedDataView}
                reportingTransactions={reportingTransactions}
                refreshData={refreshData}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
