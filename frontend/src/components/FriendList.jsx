import React, { useState, useEffect } from "react";
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, removeFriend } from "../api";

export default function FriendList({ onUpdate }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [activeTab, setActiveTab] = useState("friends"); // friends | requests

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await getFriendRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!newFriendUsername.trim()) return;

    try {
      await sendFriendRequest(newFriendUsername);
      setNewFriendUsername("");
      alert("Friend request sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await acceptFriendRequest(friendshipId);
      fetchFriends();
      fetchRequests();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (friendshipId) => {
    if (!confirm("Are you sure you want to remove this friend?")) return;
    try {
      await removeFriend(friendshipId);
      fetchFriends();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="friend-management">
      <div className="friend-header">
        <h3>👥 Friends</h3>
        
        <form onSubmit={handleSendRequest} className="add-friend-form">
          <input
            type="text"
            placeholder="Enter username to add friend"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
          />
          <button type="submit" className="btn-primary">Send Request</button>
        </form>
      </div>

      <div className="friend-tabs">
        <button
          className={`tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests ({requests.length})
        </button>
      </div>

      {activeTab === "friends" && (
        <div className="friends-list">
          {friends.length === 0 ? (
            <p className="empty-state">No friends yet. Add some friends above!</p>
          ) : (
            friends.map((friendship) => (
              <div key={friendship.id} className="friend-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {friendship.friend_username?.[0]?.toUpperCase() || "👤"}
                  </div>
                  <div className="friend-details">
                    <span className="friend-name">{friendship.friend_username}</span>
                    <span className="friend-since">
                      Friends since {new Date(friendship.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(friendship.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "requests" && (
        <div className="requests-list">
          {requests.length === 0 ? (
            <p className="empty-state">No pending friend requests</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {request.friend_username?.[0]?.toUpperCase() || "👤"}
                  </div>
                  <div className="friend-details">
                    <span className="friend-name">{request.friend_username}</span>
                    <span className="request-time">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="btn-accept"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRemove(request.id)}
                    className="btn-reject"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
