const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Auth helpers
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
export const isAuthenticated = () => !!getToken();

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`
});

// Auth APIs
export async function register(username, email, password) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, email, password})
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Registration failed");
  }
  return res.json();
}

export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/api/token`, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: formData
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Invalid credentials");
  }
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

// Expense APIs
export async function getExpenses() {
  const res = await fetch(`${API_URL}/api/expenses`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function addExpense(expense) {
  const res = await fetch(`${API_URL}/api/expenses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(expense)
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${API_URL}/api/expenses/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(expense)
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/api/expenses/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

// Budget APIs
export async function getBudgets() {
  const res = await fetch(`${API_URL}/api/budgets`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch budgets");
  return res.json();
}

export async function createBudget(budget) {
  const res = await fetch(`${API_URL}/api/budgets`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(budget)
  });
  if (!res.ok) throw new Error("Failed to create budget");
  return res.json();
}

// Analytics APIs
export async function getCategoryAnalytics() {
  const res = await fetch(`${API_URL}/api/analytics/category`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function getMonthlyAnalytics() {
  const res = await fetch(`${API_URL}/api/analytics/monthly`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

// Debt APIs
export async function getDebts() {
  const res = await fetch(`${API_URL}/api/debts`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch debts");
  return res.json();
}

export async function addDebt(debt) {
  const res = await fetch(`${API_URL}/api/debts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(debt)
  });
  if (!res.ok) throw new Error("Failed to add debt");
  return res.json();
}

export async function updateDebt(id, debt) {
  const res = await fetch(`${API_URL}/api/debts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(debt)
  });
  if (!res.ok) throw new Error("Failed to update debt");
  return res.json();
}

export async function deleteDebt(id) {
  const res = await fetch(`${API_URL}/api/debts/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete debt");
  return res.json();
}

// Friend APIs
export async function getFriends() {
  const res = await fetch(`${API_URL}/api/friends`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}

export async function getFriendRequests() {
  const res = await fetch(`${API_URL}/api/friends/requests`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch friend requests");
  return res.json();
}

export async function sendFriendRequest(username) {
  const res = await fetch(`${API_URL}/api/friends/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ friend_username: username })
  });
  if (!res.ok) throw new Error("Failed to send friend request");
  return res.json();
}

export async function acceptFriendRequest(friendshipId) {
  const res = await fetch(`${API_URL}/api/friends/${friendshipId}/accept`, {
    method: "PUT",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to accept friend request");
  return res.json();
}

export async function removeFriend(friendshipId) {
  const res = await fetch(`${API_URL}/api/friends/${friendshipId}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to remove friend");
  return res.json();
}

// Split Expense APIs
export async function getSplitExpenses() {
  const res = await fetch(`${API_URL}/api/split-expenses`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch split expenses");
  return res.json();
}

export async function addSplitExpense(splitExpense) {
  const res = await fetch(`${API_URL}/api/split-expenses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(splitExpense)
  });
  if (!res.ok) throw new Error("Failed to add split expense");
  return res.json();
}

export async function deleteSplitExpense(id) {
  const res = await fetch(`${API_URL}/api/split-expenses/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete split expense");
  return res.json();
}

