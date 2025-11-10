import React from "react";

export default function Header({ onLogout }) {
  return (
    <div className="header">
      <div className="header-content">
        <div>
          <h1>💰 Expense Tracker</h1>
          <p>Take control of your finances, one expense at a time</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="btn btn-logout">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
