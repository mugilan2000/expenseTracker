import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../api/expenseTrackerAPI";
import { Share } from "@capacitor/share";

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
      await Filesystem.writeFile({
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

  const actionButtonClasses =
    "inline-flex items-center justify-center gap-1.5 rounded-control border border-border bg-transparent px-4 py-2 text-[13px] font-medium text-text2 transition-colors hover:bg-surface3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";
  const mobileMenuClasses = `fixed right-0 top-0 z-[95] hidden h-dvh w-[min(84vw,280px)] flex-col gap-2.5 overflow-y-auto rounded-l-3xl border-l border-border bg-surface p-4 shadow-2xl ${isMobileMenuOpen ? "max-[560px]:flex" : "max-[560px]:hidden"}`;

  const selectDataView = (view, closeMenuAfterSelect = false) => {
    setSelectedDataView(view);
    setIsDataViewOpen(false);
    if (closeMenuAfterSelect) closeMobileMenu();
  };

  const renderDataViewOptions = (closeMenuAfterSelect = false, stretch = false) => (
    <ul className={`absolute left-0 top-[calc(100%+8px)] z-20 m-0 min-w-36 list-none rounded-control border border-border bg-surface p-1.5 shadow-xl ${stretch ? "right-0 w-full" : ""}`}>
      {["overall", "monthly"].map((view) => (
        <li
          key={view}
          onClick={() => selectDataView(view, closeMenuAfterSelect)}
          className={`cursor-pointer rounded-lg px-3 py-2.5 text-[13px] font-semibold text-text2 hover:bg-surface3 ${selectedDataView === view ? "bg-surface3" : "bg-transparent"}`}
        >
          {view === "overall" ? "Overall" : "Monthly"}
        </li>
      ))}
    </ul>
  );

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
        <header className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b border-border bg-surface px-4 min-[561px]:px-7">
          <div className="font-brand text-[22px] text-text">
            Expense<span>Tracker</span>
          </div>

          <div className="flex items-center gap-2.5 max-[560px]:hidden">
            <button
              type="button"
              className={`${actionButtonClasses} min-w-[92px]`}
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <span id="month-label" className="text-[13px] text-text3"></span>
            <div className="relative">
              <button
                className={actionButtonClasses}
                type="button"
                onClick={() => setIsDataViewOpen((prev) => !prev)}
              >
                <span>{selectedDataView === "monthly" ? "Monthly" : "Overall"}</span>
                <span className="text-[10px] opacity-80">▾</span>
              </button>

              {isDataViewOpen && renderDataViewOptions()}
            </div>
            <button className={actionButtonClasses} onClick={exportCSV}>
              Export CSV
            </button>
            <button className={actionButtonClasses} onClick={handleLogout}>
              Logout
            </button>
          </div>

          <button
            type="button"
            className="hidden size-10 items-center justify-center rounded-full border border-border bg-surface2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[560px]:flex"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div
            className={`fixed inset-0 z-[90] hidden bg-black/35 transition-opacity max-[560px]:block ${isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={closeMobileMenu}
          />

          <div className={mobileMenuClasses}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-bold text-text2">
                Menu
              </span>
              <button
                type="button"
                className={`${actionButtonClasses} px-2.5 py-1.5`}
                onClick={closeMobileMenu}
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className={`${actionButtonClasses} w-full justify-start`}
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? " Light" : " Dark"}</span>
            </button>

            <div className="relative w-full">
              <button
                type="button"
                className={`${actionButtonClasses} w-full justify-start`}
                onClick={() => setIsDataViewOpen((prev) => !prev)}
              >
                <span>{selectedDataView === "monthly" ? "Monthly" : "Overall"}</span>
                <span className="ml-1.5">▾</span>
              </button>

              {isDataViewOpen && renderDataViewOptions(true, true)}
            </div>

            <button
              className={`${actionButtonClasses} w-full justify-start`}
              onClick={() => {
                exportCSV();
                closeMobileMenu();
              }}
            >
              Export CSV
            </button>
             <button className={`${actionButtonClasses} w-full justify-start`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b border-border bg-surface px-4 min-[561px]:px-7">
          <div className="font-brand text-[22px] text-text">
            Expense<span>Tracker</span>
          </div>
          <div className="flex items-center gap-2.5 max-[560px]:hidden">
            <button
              type="button"
              className={`${actionButtonClasses} min-w-[92px]`}
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
          </div>

          <button
            type="button"
            className="hidden size-10 items-center justify-center rounded-full border border-border bg-surface2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[560px]:flex"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div
            className={`fixed inset-0 z-[90] hidden bg-black/35 transition-opacity max-[560px]:block ${isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={closeMobileMenu}
          />

          <div className={mobileMenuClasses}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-bold text-text2">
                Menu
              </span>
              <button
                type="button"
                className={`${actionButtonClasses} px-2.5 py-1.5`}
                onClick={closeMobileMenu}
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className={`${actionButtonClasses} w-full justify-start`}
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
