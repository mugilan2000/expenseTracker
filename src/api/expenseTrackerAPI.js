import { fetchData, postData, deleteData, loginUser, registerUser } from './apiClient';

export const getData = async () => fetchData();

export const addData = async (payload) => postData(payload);

export const deleteExpense = async (payload) => deleteData(payload);

export const login = async (payload) => loginUser(payload);

export const register = async (payload) => registerUser(payload);

export const fmt = (n) => {
  return (
    Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

export const toast = (msg) => {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
};

export const refreshCache = async (data) => {
  localStorage.removeItem("transactions");
  localStorage.setItem("transactions", JSON.stringify(data));
};