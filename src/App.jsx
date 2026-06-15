import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import ExpenseList from "./components/ExpenseList";
import SideBar from "./components/SideBar";
import { getData } from "./api/expenseTrackerAPI";

function App() {
  const [count, setCount] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  const refreshData = async () => {
    const existingData = JSON.parse(localStorage.getItem("transactions"));
    if (existingData && existingData.length > 0) {
      setAllTransactions(existingData);
      return;
    }
    const data = await getData();
    localStorage.removeItem("transactions");
    localStorage.setItem("transactions", JSON.stringify(data));
    setAllTransactions(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <>
      <div className="app">
        <Header allTransactions={allTransactions}  />
        <main>
          <Dashboard allTransactions={allTransactions} />
          <div class="content-grid">
            <div>
              <AddTransaction allTransactions={allTransactions} refreshData={refreshData} />
              <ExpenseList allTransactions={allTransactions} refreshData={refreshData} />
            </div>
            <SideBar allTransactions={allTransactions} />
          </div>
        </main>
      </div>
      <div id="toast"></div>
    </>
  );
}

export default App;
