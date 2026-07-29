import React, { useEffect, useState } from "react";
import { deleteExpense, fmt, toast } from "../api/expenseTrackerAPI";

const ExpenseList = ({ allTransactions, refreshData }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

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
    setCurrentPage(1);
  };

   const deleteTransaction = async (id) => {
    const payload = {
        id: id
    }
    await deleteExpense(payload);
    await refreshData(true);
    toast("Transaction Deleted");
  }

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await refreshData(true);
      toast("Transactions refreshed");
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
      toast("Failed to refresh transactions");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [filter, searchQuery, allTransactions]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleTransactions = transactions.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const handlePageChange = (nextPage) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, nextPage)));
  };

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
            visibleTransactions.map((t) => (
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", gap: "10px", flexWrap: "nowrap", width: "100%", overflowX: "auto" }}>
          <button
            className="btn btn-ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
          >
            <span>{isRefreshing ? "⏳" : "↻"}</span>
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto", flexWrap: "nowrap", minWidth: 0, flexShrink: 0 }}>
            <label style={{ fontSize: "12px", color: "var(--text3)", flexShrink: 0 }} htmlFor="page-size-select">
              Show
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                background: "var(--surface2)",
                // borderRadius: "999px",
                padding: "6px 10px",
                color: "var(--text)",
                fontSize: "12px",
                flexShrink: 0,
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button className="btn btn-ghost" onClick={() => handlePageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} style={{ padding: "6px 10px" }}>
                  Prev
                </button>
                <span style={{ fontSize: "12px", color: "var(--text3)" }}>
                  {safeCurrentPage}/{totalPages}
                </span>
                <button className="btn btn-ghost" onClick={() => handlePageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} style={{ padding: "6px 10px" }}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
