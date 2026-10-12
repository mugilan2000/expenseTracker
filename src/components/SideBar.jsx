import { useEffect, useState } from "react";
import { fmt } from "../api/expenseTrackerAPI";

const SideBar = ({ allTransactions, reportingTransactions = allTransactions }) => {
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
  
  const [spent, setSpent] = useState(0);
  const [budget, setBudget] = useState(localStorage.getItem("budget") || 0);
  const [budgetInput, setBudgetInput] = useState("");
  const [pct, setPct] = useState(0); 
  const [days, setDays] = useState(new Set());
  const [sortedCategories, setSortedCategories] = useState([]);
  const [maxCategoryAmount, setMaxCategoryAmount] = useState(1);

   function renderBudget() {

    let transactions = allTransactions;
    const currentMonthExpenses = transactions
      .filter(
        (t) =>
          new Date(t.expDate).toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          }) ===
          new Date().toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          }),
      )
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    setSpent(fmt(currentMonthExpenses));
    if (budget) {
      const pct = Math.min(
        100,
        Math.round((currentMonthExpenses / budget) * 100),
      );
        setPct(pct);
    }
  }

  function renderStreak() {
    let transactions = allTransactions;
    const daysSet = new Set(transactions.map((t) => t.expDate));
    setDays(daysSet);
  }

  function renderCatChart() {
    let transactions = reportingTransactions;
    const totals = {};
    transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
    const max = sorted[0]?.[1] || 1;
    setSortedCategories(sorted);
    setMaxCategoryAmount(max);
  }

  useEffect(() => {
    renderBudget();
    renderStreak();
    renderCatChart();
  }, [budget, allTransactions, reportingTransactions]);
  return (
    <>
      <div className="flex flex-col gap-3.5">
        <div className="rounded-card border border-border bg-surface p-4 min-[561px]:p-[22px]">
          <div className="mb-[18px] flex items-center gap-2 text-[15px] font-semibold text-text">
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            Monthly budget
          </div>
          <div className="mt-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] text-text2">Spent</span>
              <span
                className="text-[13px] font-semibold"
                id="budget-spent"
                style={{ color: "var(--red)" }}
              >
                ₹{spent}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] text-text2">Budget</span>
              <span className="text-[13px] font-semibold" id="budget-set">
                ₹{budget ? fmt(budget) : "Not set"}
              </span>
            </div>
            <div className="mb-1.5 h-2.5 overflow-hidden rounded-md bg-surface3">
              <div
                className={`h-full rounded-md transition-all ${pct >= 100 ? "bg-red" : pct >= 75 ? "bg-amber" : "bg-green"}`}
                id="budget-bar"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <div
              className="text-xs text-text3"
              id="budget-pct"
            >
              {pct > 0 ? `${pct}% of budget used` : "Set a budget below"}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <input
                className="min-w-0 flex-1 rounded-control border border-border bg-surface2 px-3 py-2 text-[13px] text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                type="number"
                id="budget-input"
                placeholder="Set monthly budget (₹)"
                min="0"
                step="100"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <button
                className="rounded-control bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => {
                  if (budgetInput !== "") {
                    setBudget(budgetInput);
                    localStorage.setItem("budget", budgetInput);
                    setBudgetInput("");
                  }
                }}
              >
                Set
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 min-[561px]:p-[22px]">
          <div className="mb-[18px] flex items-center gap-2 text-[15px] font-semibold text-text">
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21H3V3" />
              <path d="M7 10l4 4 4-4 4 4" />
            </svg>
            Spending by category
          </div>
          <div className="mt-1 flex flex-col gap-2.5" id="cat-chart">
            {sortedCategories.length ? (
              sortedCategories.map(([category, amount]) => (
                <div key={category} className="grid grid-cols-[minmax(0,100px)_minmax(0,1fr)_52px] items-center gap-2.5">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-text2">{CATEGORIES[category].emoji} {category}</div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface3"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.round((amount / maxCategoryAmount) * 100)}%`, background: `${CATEGORIES[category].color}` }}></div></div>
                  <div className="text-right text-xs font-medium text-text2">₹{fmt(amount)}</div>
                </div>
              ))
            ) : (
              <p>No spending data available.</p>
            )}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 min-[561px]:p-[22px]">
          <div className="mb-[18px] flex items-center gap-2 text-[15px] font-semibold text-text">
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Day streak
          </div>
          <div
            id="streak-info"
            className="text-[13px] leading-[1.7] text-text2"
          ><div style={{ marginBottom: "6px" }}><span style={{ fontSize: "22px", fontWeight: "600", color: "var(--amber)" }}>{days.size}</span> <span style={{ color: "var(--text3)" }}>days tracked</span></div>
    <div className="text-text3">{allTransactions.length} total transactions</div></div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
