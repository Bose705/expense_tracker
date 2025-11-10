import React, { useState } from "react";
import { addDebt } from "../api";

export default function DebtForm({ onDebtAdded }) {
  const [form, setForm] = useState({
    name: "",
    principal_amount: "",
    interest_rate: "",
    emi_amount: "",
    emi_date: "",
    start_date: new Date().toISOString().split("T")[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDebt({
        ...form,
        principal_amount: parseFloat(form.principal_amount),
        interest_rate: parseFloat(form.interest_rate),
        emi_amount: parseFloat(form.emi_amount),
        emi_date: parseInt(form.emi_date)
      });
      setForm({
        name: "",
        principal_amount: "",
        interest_rate: "",
        emi_amount: "",
        emi_date: "",
        start_date: new Date().toISOString().split("T")[0]
      });
      if (onDebtAdded) onDebtAdded();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form debt-form">
      <h3>📋 Add New Debt</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Debt Name</label>
          <input
            type="text"
            placeholder="e.g., Car Loan, Home Loan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Principal Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            placeholder="100000"
            value={form.principal_amount}
            onChange={(e) => setForm({ ...form, principal_amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            placeholder="8.5"
            value={form.interest_rate}
            onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>EMI Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            placeholder="5000"
            value={form.emi_amount}
            onChange={(e) => setForm({ ...form, emi_amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>EMI Date (Day of Month)</label>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="5"
            value={form.emi_date}
            onChange={(e) => setForm({ ...form, emi_date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-primary">Add Debt</button>
    </form>
  );
}
