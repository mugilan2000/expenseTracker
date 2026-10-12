import { useEffect, useState } from "react";
import { fmt } from "../api/expenseTrackerAPI";

const Dashboard = ({ allTransactions }) => {
  const [isTotalIncomeVisibile, setIsTotalIncomeVisible] = useState(false);
  const [isNetBalanceVisible, setIsNetBalanceVisible] = useState(false);
  const [isTotalExpensesVisible, setIsTotalExpensesVisible] = useState(false);
  const [isMonthExpenseVisible, setIsMonthExpenseVisible] = useState(false);

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
            new Date(t.expDate).toLocaleString("en-IN", {
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
      <div className="mb-5">
        <h3 className="text-base font-semibold text-text">Hello, {localStorage.getItem("username")}</h3>
      </div>
      <div className="mb-7 grid grid-cols-2 gap-3.5 min-[901px]:grid-cols-4">
        <div className="relative overflow-hidden rounded-card border border-t-2 border-t-green border-border bg-surface p-4 min-[561px]:p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[1px] text-text3">Total Income</div>
          <button
            type="button"
            className="block w-full cursor-pointer text-left text-[20px] font-semibold text-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[561px]:text-[26px]"
            id="total-income"
            aria-pressed={isTotalIncomeVisibile}
            aria-label={isTotalIncomeVisibile ? "Hide total income" : "Show total income"}
            onClick={() => setIsTotalIncomeVisible(!isTotalIncomeVisibile)}
          >
            <span id="val-income" className="inline-block min-w-[90px]">
              {isTotalIncomeVisibile ? `₹${totalIncome}` : "******"}
            </span>
          </button>
          <div className="mt-1 text-xs text-text3" id="income-count">
            {incomeCount} transactions
          </div>
        </div>
        <div className="relative overflow-hidden rounded-card border border-t-2 border-t-red border-border bg-surface p-4 min-[561px]:p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[1px] text-text3">Total Expenses</div>
          <button
            type="button"
            className="block w-full cursor-pointer text-left text-[20px] font-semibold text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[561px]:text-[26px]"
            id="total-expenses"
            aria-pressed={isTotalExpensesVisible}
            aria-label={isTotalExpensesVisible ? "Hide total expenses" : "Show total expenses"}
            onClick={() => setIsTotalExpensesVisible(!isTotalExpensesVisible)}
          >
            <span id="val-expenses" className="inline-block min-w-[90px]">
              {isTotalExpensesVisible ? `₹${totalExpenses}` : "******"}
            </span>
          </button>
          <div className="mt-1 text-xs text-text3" id="expense-count">
            {expenseCount} transactions
          </div>
        </div>
        <div className="relative overflow-hidden rounded-card border border-t-2 border-t-amber border-border bg-surface p-4 min-[561px]:p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[1px] text-text3">Net Balance</div>
          <button
            type="button"
            className="block w-full cursor-pointer text-left text-[20px] font-semibold text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[561px]:text-[26px]"
            id="net-balance"
            aria-pressed={isNetBalanceVisible}
            aria-label={isNetBalanceVisible ? "Hide net balance" : "Show net balance"}
            onClick={() => setIsNetBalanceVisible(!isNetBalanceVisible)}
          >
            <span id="val-net" className="inline-block min-w-[90px]">
              {isNetBalanceVisible ? `₹${netBalance}` : "******"}
            </span>
          </button>
          <div className="mt-1 text-xs text-text3">as of today</div>
        </div>
        <div className="relative overflow-hidden rounded-card border border-t-2 border-t-blue border-border bg-surface p-4 min-[561px]:p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[1px] text-text3">Month Expense</div>
          <button
            type="button"
            className="block w-full cursor-pointer text-left text-[20px] font-semibold text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-[561px]:text-[26px]"
            id="month-expense"
            aria-pressed={isMonthExpenseVisible}
            aria-label={isMonthExpenseVisible ? "Hide month expense" : "Show month expense"}
            onClick={() => setIsMonthExpenseVisible(!isMonthExpenseVisible)}
          >
            <span id="val-month" className="inline-block min-w-[90px]">
              {isMonthExpenseVisible ? `₹${monthExpense}` : "******"}
            </span>
          </button>
          <div className="mt-1 text-xs text-text3" id="biggest-cat">
            All categories
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
