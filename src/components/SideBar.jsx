import React, { useEffect, useState } from "react";
import { fmt } from "../api/expenseTrackerAPI";

const SideBar = ({ allTransactions }) => {
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
    console.log("All transactions:", transactions);
    const currentMonthExpenses = transactions
      .filter(
        (t) =>
          new Date(t.date).toLocaleString("en-IN", {
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
    console.log("Current month expenses:", currentMonthExpenses);

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
    const daysSet = new Set(transactions.map((t) => t.date));
    setDays(daysSet);
  }

  function renderCatChart() {
    let transactions = allTransactions;
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
  }, [budget, allTransactions]);
  return (
    <>
      <div class="sidebar">
        <div class="card">
          <div class="card-title">
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
          <div class="budget-section">
            <div class="budget-row">
              <span class="budget-label">Spent</span>
              <span
                class="budget-val"
                id="budget-spent"
                style={{ color: "var(--red)" }}
              >
                ₹{spent}
              </span>
            </div>
            <div class="budget-row">
              <span class="budget-label">Budget</span>
              <span class="budget-val" id="budget-set">
                ₹{budget ? fmt(budget) : "Not set"}
              </span>
            </div>
            <div class="big-bar-track">
              <div
                class={"big-bar-fill" + (pct >= 100 ? " danger" : pct >= 75 ? " warn" : "")}
                id="budget-bar"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <div
              style={{ fontSize: "12px", color: "var(--text3)" }}
              id="budget-pct"
            >
              {pct > 0 ? `${pct}% of budget used` : "Set a budget below"}
            </div>
            <div class="budget-input-row">
              <input
                type="number"
                id="budget-input"
                placeholder="Set monthly budget (₹)"
                min="0"
                step="100"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <button
                class="btn btn-primary"
                onClick={() => {
                  if (budgetInput !== "") {
                    setBudget(budgetInput);
                    localStorage.setItem("budget", budgetInput);
                    setBudgetInput("");
                  }
                }}
                style={{ padding: "8px 12px", fontSize: "12px" }}
              >
                Set
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">
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
          <div class="bar-chart" id="cat-chart">
            {sortedCategories.length ? (
              sortedCategories.map(([category, amount]) => (
                <div key={category} class="bar-row">
                  <div class="bar-label">{CATEGORIES[category].emoji} {category}</div>
                  <div class="bar-track"><div class="bar-fill" style={{ width: `${Math.round((amount / maxCategoryAmount) * 100)}%`, background: `${CATEGORIES[category].color}` }}></div></div>
                  <div class="bar-val">₹{fmt(amount)}</div>
                </div>
              ))
            ) : (
              <p>No spending data available.</p>
            )}
          </div>
        </div>

        <div class="card">
          <div class="card-title">
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
            style={{
              fontSize: "13px",
              color: "var(--text2)",
              lineHeight: "1.7",
            }}
          ><div style={{ marginBottom: "6px" }}><span style={{ fontSize: "22px", fontWeight: "600", color: "var(--amber)" }}>{days.size}</span> <span style={{ color: "var(--text3)" }}>days tracked</span></div>
    <div style={{ color: "var(--text3)" }}>{allTransactions.length} total transactions</div></div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
