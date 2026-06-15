import React, { useState } from "react";

const Header = ({ allTransactions }) => {
  function exportCSV() {
    let transactions = allTransactions;
    if (!transactions.length) {
      toast("No transactions to export");
      return;
    }
    const header = "ID,Date,Description,Category,Type,Amount,Payment\n";
    const rows = transactions
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
      .map(
        (t) =>
          `${t.id},${t.date},"${t.name}",${t.category},${t.type},${t.amount},${t.payment}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download =
      new Date().toLocaleString("en-IN", { month: "long", year: "numeric" }) +
      " Report.csv";
    a.click();
  }
  return (
    <>
      <header>
        <div class="logo">
          Expense<span>Tracker</span>
        </div>
        <div class="header-actions">
          <span
            id="month-label"
            style={{ fontSize: "13px", color: "var(--text3)" }}
          ></span>
          <button class="btn btn-ghost" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
