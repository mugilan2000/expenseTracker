import React, { useEffect, useState } from "react";
import { addData, toast } from "../api/expenseTrackerAPI";

const AddTransaction = ({ allTransactions, refreshData }) => {
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

  const [activeType, setActiveType] = useState("expense");
  const [activeCat, setActiveCat] = useState("Food");
  const [cats, setCats] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [payment, setPayment] = useState("UPI");

  function setType(type) {
    setActiveType(type);
    buildCatChips();
  }

  function selectCat(c) {
    setActiveCat(c);
    buildCatChips();
  }

  function buildCatChips() {
    const cats =
      activeType === "income"
        ? ["Salary", "Freelance", "Investment", "Other"]
        : Object.keys(CATEGORIES).filter(
            (c) => !["Salary", "Freelance", "Investment"].includes(c),
          );
    setCats(cats);
    if (!cats.includes(activeCat)) setActiveCat(cats[0]);
    // const container = document.getElementById("cat-chips");
    // container.innerHTML = cats
    //   .map(
    //     (c) => `<button class="cat-chip" onClick="{() => selectCat('${c}')}"
    // style="${activeCat === c ? `background:${CATEGORIES[c].color}22;border-color:${CATEGORIES[c].color};color:${CATEGORIES[c].color}` : ""}"
    // >${CATEGORIES[c].emoji} ${c}</button>`,
    //   )
    //   .join("");
  }

  const handleAddTransaction = async () => {
    if (!description || !amount || !date || !payment) {
      toast("Please fill all the fields");
      return;
    }
    const payload = {
      name: description,
      amount: Number(amount),
        expDate: date,
        payment: payment,
        category: activeCat,
        type: activeType,
      };

    await addData(payload);
    localStorage.removeItem("transactions");
    await refreshData();
    toast("Transaction Added");
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setPayment("UPI");
  };

  useEffect(() => {
    buildCatChips();
  }, [activeType, activeCat]);
  return (
    <>
      <div class="card" style={{ marginBottom: "18px" }}>
        <div class="card-title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add transaction
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            class={activeType === "expense" ? "type-btn active-expense" : "type-btn"}
            id="btn-expense"
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            class={activeType === "income" ? "type-btn active-income" : "type-btn"}
            id="btn-income"
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Description</label>
            <input
              type="text"
              id="inp-name"
              placeholder="e.g. Lunch at Saravana Bhavan"
              maxlength="60"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div class="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              id="inp-amount"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date</label>
            <input type="date" id="inp-date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div class="form-group">
            <label>Payment</label>
            <select id="inp-payment" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Net Banking</option>
              <option>Wallet</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Category</label>
          <div class="cat-chips" id="cat-chips">
            {cats.map((c) => (
              <button
                key={c}
                class="cat-chip"
                onClick={() => selectCat(c)}
                style={activeCat === c ? { background: `${CATEGORIES[c].color}22`, borderColor: CATEGORIES[c].color, color: CATEGORIES[c].color } : {}}
              >
                {CATEGORIES[c].emoji} {c}
              </button>
            ))}
          </div>
        </div>
        <button class="btn btn-primary" style={{ width: "100%" }} onClick={handleAddTransaction}>
          Add transaction
        </button>
      </div>
    </>
  );
};

export default AddTransaction;
