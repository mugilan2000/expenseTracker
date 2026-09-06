import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../api/expenseTrackerAPI";

const Header = ({
  allTransactions,
  accessToken,
  setAccessToken,
  theme,
  toggleTheme,
  selectedDataView = "overall",
  setSelectedDataView,
}) => {
  const [isDataViewOpen, setIsDataViewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDarkMode = theme === "dark";

  const navigate = useNavigate();

  // function exportCSV() {
  //   let transactions = allTransactions;
  //   if (!transactions.length) {
  //     toast("No transactions to export");
  //     return;
  //   }
  //   const header = "ID,Date,Description,Category,Type,Amount,Payment\n";
  //   const rows = transactions
  //     .map(
  //       (t) =>
  //         `${t.id},${t.expDate},"${t.name}",${t.category},${t.type},${t.amount},${t.payment}`,
  //     )
  //     .join("\n");
  //   const blob = new Blob([header + rows], { type: "text/csv" });
  //   const a = document.createElement("a");
  //   a.href = URL.createObjectURL(blob);
  //   a.download = "Data Export.csv";
  //   a.click();
  // }

  async function exportCSV() {
  let transactions = allTransactions;

  if (!transactions.length) {
    toast("No transactions to export");
    return;
  }

  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    // Escape quotes and wrap values containing comma, quote or newline
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const header =
    "ID,Date,Description,Category,Type,Amount,Payment\n";

  const rows = transactions
    .map((t) =>
      [
        t.id,
        t.expDate,
        t.name,
        t.category,
        t.type,
        t.amount,
        t.payment,
      ]
        .map(escapeCSV)
        .join(",")
    )
    .join("\n");

  const csvData = header + rows;

  // Android / Capacitor
  if (Capacitor.isNativePlatform()) {
    try {
      const fileName = "Data Export.csv";

      // Save the CSV into the app's temporary cache
      const result = await Filesystem.writeFile({
        path: fileName,
        data: csvData,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      // Get a URI that Android can share
      const fileUri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
      });

      // Open Android's share dialog
      await Share.share({
        title: "Expense Tracker CSV",
        text: "Here is my expense data.",
        url: fileUri.uri,
        dialogTitle: "Export Expense Data",
      });

    } catch (error) {
      console.error("CSV export failed:", error);
      toast("Failed to export CSV");
    }

    return;
  }

  // Normal website / browser
  const blob = new Blob([csvData], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Data Export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("transactions");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setAccessToken(null);
    navigate("/login");
  }

  return (
    <>
      {accessToken ? (
        <header>
          <div className="logo">
            Expense<span>Tracker</span>
          </div>

          <div className="header-actions desktop-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: "92px",
                justifyContent: "center",
              }}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <span
              id="month-label"
              style={{ fontSize: "13px", color: "var(--text3)" }}
            ></span>
            <div style={{ position: "relative" }}>
              <button
              className="btn btn-ghost"
                type="button"
                onClick={() => setIsDataViewOpen((prev) => !prev)}
              >
                <span>{selectedDataView === "monthly" ? "Monthly" : "Overall"}</span>
                <span style={{ fontSize: "10px", opacity: 0.8 }}>▾</span>
              </button>

              {isDataViewOpen && (
                <ul
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: "140px",
                    margin: 0,
                    padding: "6px",
                    listStyle: "none",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "var(--surface)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
                    zIndex: 20,
                  }}
                >
                  <li
                    onClick={() => {
                      setSelectedDataView("overall");
                      setIsDataViewOpen(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "var(--text2)",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        selectedDataView === "overall"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "transparent",
                    }}
                  >
                    Overall
                  </li>
                  <li
                    onClick={() => {
                      setSelectedDataView("monthly");
                      setIsDataViewOpen(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "var(--text2)",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        selectedDataView === "monthly"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "transparent",
                    }}
                  >
                    Monthly
                  </li>
                </ul>
              )}
            </div>
            <button className="btn btn-ghost" onClick={exportCSV}>
              Export CSV
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div
            className={`mobile-menu-backdrop ${isMobileMenuOpen ? "open" : ""}`}
            onClick={closeMobileMenu}
          />

          <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text2)" }}>
                Menu
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeMobileMenu}
                style={{ padding: "6px 10px" }}
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className="btn btn-ghost mobile-action-btn"
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? " Light" : " Dark"}</span>
            </button>

            <div style={{ position: "relative", width: "100%" }}>
              <button
                type="button"
                className="btn btn-ghost mobile-action-btn"
                onClick={() => setIsDataViewOpen((prev) => !prev)}
              >
                <span>{selectedDataView === "monthly" ? "Monthly" : "Overall"}</span>
                <span style={{ marginLeft: "6px" }}>▾</span>
              </button>

              {isDataViewOpen && (
                <ul
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    margin: 0,
                    padding: "6px",
                    listStyle: "none",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "var(--surface)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
                    zIndex: 20,
                  }}
                >
                  <li
                    onClick={() => {
                      setSelectedDataView("overall");
                      setIsDataViewOpen(false);
                      closeMobileMenu();
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "var(--text2)",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        selectedDataView === "overall"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "transparent",
                    }}
                  >
                    Overall
                  </li>
                  <li
                    onClick={() => {
                      setSelectedDataView("monthly");
                      setIsDataViewOpen(false);
                      closeMobileMenu();
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "var(--text2)",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        selectedDataView === "monthly"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "transparent",
                    }}
                  >
                    Monthly
                  </li>
                </ul>
              )}
            </div>

            <button
              className="btn btn-ghost mobile-action-btn"
              onClick={() => {
                exportCSV();
                closeMobileMenu();
              }}
            >
              Export CSV
            </button>
             <button className="btn btn-ghost mobile-action-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
      ) : (
        <header>
          <div className="logo">
            Expense<span>Tracker</span>
          </div>
          <div className="header-actions desktop-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: "92px",
                justifyContent: "center",
              }}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div
            className={`mobile-menu-backdrop ${isMobileMenuOpen ? "open" : ""}`}
            onClick={closeMobileMenu}
          />

          <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text2)" }}>
                Menu
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeMobileMenu}
                style={{ padding: "6px 10px" }}
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className="btn btn-ghost mobile-action-btn"
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? " Light" : " Dark"}</span>
            </button>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
