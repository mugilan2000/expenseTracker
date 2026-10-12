import { useEffect, useState } from "react";
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
      <div className="rounded-card border border-border bg-surface p-4 min-[561px]:p-[22px]">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div className="text-[15px] font-semibold text-text">
            Transactions
          </div>
          <div className="shrink-0">
            <button
            className="inline-flex items-center gap-1.5 rounded-control border border-border bg-transparent px-4 py-2 text-[13px] font-medium text-text2 transition-colors hover:bg-surface3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            id="refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <span>{isRefreshing ? "⏳" : "↻"}</span>
            <span>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            className="min-w-[140px] flex-1 rounded-full border border-border bg-surface2 px-3.5 py-1.5 text-[13px] text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <button
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${filter === "all" ? "border-border2 bg-surface3 text-text" : "border-border bg-transparent text-text3 hover:border-border2 hover:bg-surface3 hover:text-text"}`}
            onClick={() => setFilterIns("all")}
          >
            All
          </button>
          <button
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${filter === "expense" ? "border-border2 bg-surface3 text-text" : "border-border bg-transparent text-text3 hover:border-border2 hover:bg-surface3 hover:text-text"}`}
            onClick={() => setFilterIns("expense")}
          >
            Expenses
          </button>
          <button
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${filter === "income" ? "border-border2 bg-surface3 text-text" : "border-border bg-transparent text-text3 hover:border-border2 hover:bg-surface3 hover:text-text"}`}
            onClick={() => setFilterIns("income")}
          >
            Income
          </button>
        </div>
        <div className="flex max-h-[480px] flex-col gap-2 overflow-y-auto pr-1" id="expense-list">
          {transactions.length ? (
            visibleTransactions.map((t) => (
              <div className="group relative flex min-w-0 items-center gap-3 rounded-control border border-border bg-surface2 p-3 transition-colors hover:border-border2 min-[561px]:px-4" key={t.id}>
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-[17px]"
                  style={{ background: `${CATEGORIES[t.category].color}22` }}
                >
                  {CATEGORIES[t.category].emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">{t.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text3">
                    <span>{new Date(t.expDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span style={{ color: CATEGORIES[t.category].color }}>{t.category}</span>
                    <span className="rounded bg-surface3 px-1.5 py-px">
                      {t.payment}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-0.5 text-sm font-semibold ${t.type === "income" ? "text-green" : "text-red"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {`₹${fmt(t.amount)}`}
                </span>
                <button className="shrink-0 rounded-md p-1 text-base leading-none text-text3 opacity-100 transition-colors hover:bg-red/15 hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[561px]:opacity-0 min-[561px]:group-hover:opacity-100 min-[561px]:group-focus-within:opacity-100" aria-label={`Delete ${t.name}`} onClick={() => deleteTransaction(t.id)}>
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-text3"><div className="mb-2.5 text-4xl">💸</div><div>No transactions yet</div></div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2.5 overflow-x-auto">
          <div className="ml-auto flex min-w-0 shrink-0 flex-nowrap items-center gap-2">
            <label className="shrink-0 text-xs text-text3" htmlFor="page-size-select">
              Show
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="shrink-0 rounded-control border border-border bg-surface2 px-2.5 py-1.5 text-xs text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button className="rounded-control border border-border bg-transparent px-2.5 py-1.5 text-xs text-text2 transition-colors hover:bg-surface3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50" onClick={() => handlePageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1}>
                  Prev
                </button>
                <span className="text-xs text-text3">
                  {safeCurrentPage}/{totalPages}
                </span>
                <button className="rounded-control border border-border bg-transparent px-2.5 py-1.5 text-xs text-text2 transition-colors hover:bg-surface3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50" onClick={() => handlePageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages}>
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
