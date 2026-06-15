import React, { useEffect, useState } from "react";
import { fmt } from "../api/expenseTrackerAPI";

const Dashboard = ({ allTransactions }) => {
  const [isTotalIncomeVisibile, setIsTotalIncomeVisible] = useState(false);
  const [isNetBalanceVisible, setIsNetBalanceVisible] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);

  const [incomeCount, setIncomeCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  function renderStats() {
    let transactions = allTransactions;
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;

    // Render income value
    setTotalIncome(fmt(income));

    // Render net balance value
    setNetBalance(fmt(net));

    setTotalExpenses(fmt(expenses));
    setIncomeCount(transactions.filter((t) => t.type === "income").length);
    setExpenseCount(transactions.filter((t) => t.type === "expense").length);
    const exp = transactions.filter((t) => t.type === "expense");
    if (exp.length) {
      //const biggest = exp.reduce((a, b) => (b.amount > a.amount ? b : a));
      const biggest = exp
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
        .reduce((a, b) => a + b.amount, 0);
      setMonthExpense(fmt(biggest));
    } else {
      setMonthExpense(fmt(0));
    }
  }

  useEffect(() => {
    renderStats();
  }, [allTransactions]);

  return (
    <>
      <div class="stats-grid">
        <div class="stat-card green">
          <div class="stat-label">Total Income</div>
          <div
            class="stat-value green"
            id="total-income"
            onClick={() => setIsTotalIncomeVisible(!isTotalIncomeVisibile)}
          >
            <span id="val-income">
              <span class="masked" style={{ width: "90px" }}>
                {isTotalIncomeVisibile ? `₹${totalIncome}` : "******"}
              </span>
            </span>
          </div>
          <div class="stat-sub" id="income-count">
            {incomeCount} transactions
          </div>
        </div>
        <div class="stat-card red">
          <div class="stat-label">Total Expenses</div>
          <div class="stat-value red" id="total-expenses">
            ₹{totalExpenses}
          </div>
          <div class="stat-sub" id="expense-count">
            {expenseCount} transactions
          </div>
        </div>
        <div class="stat-card amber">
          <div class="stat-label">Net Balance</div>
          <div
            class="stat-value amber"
            id="net-balance"
            style={{ color: "var(--green)" }}
            onClick={() => setIsNetBalanceVisible(!isNetBalanceVisible)}
          >
            <span id="val-net">
              <span class="masked" style={{ width: "90px" }}>
                {isNetBalanceVisible ? `₹${netBalance}` : "******"}
              </span>
            </span>
          </div>
          <div class="stat-sub">as of today</div>
        </div>
        <div class="stat-card blue">
          <div class="stat-label">Month Expense</div>
          <div class="stat-value blue" id="biggest-expense">
            ₹{monthExpense}
          </div>
          <div class="stat-sub" id="biggest-cat">
            All categories
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
