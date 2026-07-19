import React, { useEffect, useState } from "react";
import { deleteExpense, fmt, toast } from "../api/expenseTrackerAPI";

const ExpenseList = ({ allTransactions, refreshData }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

    const CATEGORIES = {
    Food: { emoji: "🍽", color: "#f46a6a" },
    Transport: { emoji: "🚌", color: "#5aabff" },
    Shopping: { emoji: "🛍", color: "#a394ff" },
    Health: { emoji: "💊", color: "#3ecf8e" },
    Entertainment: { emoji: "🎬", color: "#f9b44a" },
    Bills: { emoji: "📄", color: "#36c6c6" },
    Education: { emoji: "📚", color: "#ff8fa3" },
    "Home & Rent": { emoji: "🏠", color: "#72e4b8" },
    Salary: { emoji: "💼", color: "#3ecf8e" },
    Freelance: { emoji: "💻", color: "#a394ff" },
    Investment: { emoji: "📈", color: "#5aabff" },
    Other: { emoji: "✦", color: "#9ba3b4" },
  };
  
  const setFilterIns = (f) => {
    setFilter(f);
  };

  const applyFilter = () => {
    const q = searchQuery.trim().toLowerCase();

    const list = allTransactions.filter((t) => {
      if (filter.toLowerCase() === "expense" && t.type.toLowerCase() !== "expense") return false;
      if (filter.toLowerCase() === "income" && t.type.toLowerCase() !== "income") return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      return true;
    });

    setTransactions(list);
  };

   const deleteTransaction = async (id) => {
    const payload = {
        id: id
    }
    await deleteExpense(payload);
    localStorage.removeItem("transactions");
    await refreshData();
    toast("Transaction Deleted");
  }

  useEffect(() => {
    applyFilter();
  }, [filter, searchQuery, allTransactions]);
  return (
    <>
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <div className="card-title" style={{ marginBottom: "0" }}>
            Transactions
          </div>
        </div>
        <div className="filter-bar">
          <input
            className="search-input"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <button
            className={filter === "all" ? "filter-chip active" : "filter-chip"}
            onClick={() => setFilterIns("all")}
          >
            All
          </button>
          <button
            className={filter === "expense" ? "filter-chip active" : "filter-chip"}
            onClick={() => setFilterIns("expense")}
          >
            Expenses
          </button>
          <button
            className={filter === "income" ? "filter-chip active" : "filter-chip"}
            onClick={() => setFilterIns("income")}
          >
            Income
          </button>
        </div>
        <div className="expense-list" id="expense-list">
          {transactions.length ? (
            transactions.map((t) => (
              <div className="expense-item" key={t.id}>
                <div
                  className="expense-icon"
                  style={{ background: CATEGORIES[t.category].color + "22" }}
                >
                  {CATEGORIES[t.category].emoji}
                </div>
                <div className="expense-info">
                  <div className="expense-name">{t.name}</div>
                  <div className="expense-meta">
                    <span>{new Date(t.expDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span style={{ color: CATEGORIES[t.category].color }}>{t.category}</span>
                    <span
                      style={{
                        background: "var(--surface3)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {t.payment}
                    </span>
                  </div>
                </div>
                <span
                  className={t.type === "income" ? "expense-amount income" : "expense-amount"}
                  style={{ padding: "2px" }}
                >
                  {t.type === "income" ? "+" : "-"}
                  {`₹${fmt(t.amount)}`}
                </span>
                <button className="del-btn" onClick={() => deleteTransaction(t.id)}>
                  ×
                </button>
              </div>
            ))
          ) : (
            <div class="empty"><div class="empty-icon">💸</div><div>No transactions yet</div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
