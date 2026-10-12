import { useEffect, useState } from "react";
import { addData, toast } from "../api/expenseTrackerAPI";

const AddTransaction = ({ refreshData }) => {
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
  const inputClasses =
    "w-full rounded-control border border-border bg-surface2 px-3 py-2.5 font-sans text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

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
    await refreshData(true);
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
      <div className="mb-[18px] rounded-card border border-border bg-surface p-4 min-[561px]:p-[22px]">
        <div className="mb-[18px] flex items-center gap-2 text-[15px] font-semibold text-text">
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
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            className={`rounded-full border px-5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${activeType === "expense" ? "border-red bg-red/15 text-red" : "border-border bg-transparent text-text3 hover:border-border2"}`}
            id="btn-expense"
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`rounded-full border px-5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${activeType === "income" ? "border-green bg-green/15 text-green" : "border-border bg-transparent text-text3 hover:border-border2"}`}
            id="btn-income"
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[561px]:grid-cols-2">
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label>Description</label>
            <input
              className={inputClasses}
              type="text"
              id="inp-name"
              placeholder="e.g. Lunch at Saravana Bhavan"
              maxLength="60"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label>Amount (₹)</label>
            <input
              className={inputClasses}
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
        <div className="grid grid-cols-1 gap-3 min-[561px]:grid-cols-2">
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label>Date</label>
            <input className={inputClasses} type="date" id="inp-date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label>Payment</label>
            <select className={inputClasses} id="inp-payment" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Net Banking</option>
              <option>Wallet</option>
            </select>
          </div>
        </div>
        <div className="mb-3.5 flex flex-col gap-1.5">
          <label>Category</label>
          <div className="mb-3.5 flex flex-wrap gap-2" id="cat-chips">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                className="rounded-full border border-border bg-transparent px-3.5 py-1.5 text-xs font-medium text-text2 transition-colors hover:border-border2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => selectCat(c)}
                style={activeCat === c ? { background: `${CATEGORIES[c].color}22`, borderColor: CATEGORIES[c].color, color: CATEGORIES[c].color } : {}}
              >
                {CATEGORIES[c].emoji} {c}
              </button>
            ))}
          </div>
        </div>
        <button className="w-full rounded-control bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={handleAddTransaction}>
          Add transaction
        </button>
      </div>
    </>
  );
};

export default AddTransaction;
