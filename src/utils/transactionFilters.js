export const REPORTING_PERIODS = {
  OVERALL: "overall",
  MONTHLY: "monthly",
};

function parseTransactionDate(value) {
  if (typeof value === "string") {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnlyMatch) {
      return new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      );
    }
  }

  return new Date(value);
}

export function isInCurrentMonth(value, referenceDate = new Date()) {
  const transactionDate = parseTransactionDate(value);

  return (
    !Number.isNaN(transactionDate.getTime()) &&
    transactionDate.getFullYear() === referenceDate.getFullYear() &&
    transactionDate.getMonth() === referenceDate.getMonth()
  );
}

export function filterTransactionsByPeriod(transactions, period) {
  if (period !== REPORTING_PERIODS.MONTHLY) return transactions;

  return transactions.filter((transaction) =>
    isInCurrentMonth(transaction.expDate),
  );
}