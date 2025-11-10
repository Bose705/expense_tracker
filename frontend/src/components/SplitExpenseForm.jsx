import React, { useState, useEffect } from "react";
import { addSplitExpense, getFriends } from "../api";

export default function SplitExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState({
    description: "",
    total_amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    participant_ids: []
  });
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.participant_ids.length === 0) {
      alert("Please select at least one friend to split with");
      return;
    }

    try {
      await addSplitExpense({
        ...form,
        total_amount: parseFloat(form.total_amount),
        participant_ids: form.participant_ids.map(id => parseInt(id))
      });
      setForm({
        description: "",
        total_amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        participant_ids: []
      });
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleFriend = (friendId) => {
    const currentIds = form.participant_ids;
    if (currentIds.includes(friendId)) {
      setForm({ ...form, participant_ids: currentIds.filter(id => id !== friendId) });
    } else {
      setForm({ ...form, participant_ids: [...currentIds, friendId] });
    }
  };

  const calculateSplitAmount = () => {
    if (!form.total_amount || form.participant_ids.length === 0) return 0;
    // +1 for the current user
    return (parseFloat(form.total_amount) / (form.participant_ids.length + 1)).toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form split-expense-form">
      <h3>🤝 Split an Expense</h3>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Description</label>
          <input
            type="text"
            placeholder="e.g., Dinner at restaurant"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            placeholder="1000"
            value={form.total_amount}
            onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Split with Friends</label>
        {friends.length === 0 ? (
          <p className="info-text">Add friends first to split expenses with them!</p>
        ) : (
          <div className="friend-selector">
            {friends.map((friendship) => {
              const friendId = friendship.friend_id;
              const isSelected = form.participant_ids.includes(friendId);
              
              return (
                <button
                  key={friendship.id}
                  type="button"
                  className={`friend-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleFriend(friendId)}
                >
                  <span className="friend-name">{friendship.friend_username}</span>
                  {isSelected && <span className="checkmark">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {form.total_amount && form.participant_ids.length > 0 && (
        <div className="split-preview">
          <p>
            <strong>Split Amount:</strong> ₹{calculateSplitAmount()} per person 
            ({form.participant_ids.length + 1} people)
          </p>
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={friends.length === 0}>
        Add Split Expense
      </button>
    </form>
  );
}
