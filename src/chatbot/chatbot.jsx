import React, { useState } from "react";
import "./Chatbot.css";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setLoading(true);

    const eventSource = new EventSource("http://localhost:5000/api/query");

    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: event.data, sender: "bot" },
      ]);
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error("Error:", err);
      eventSource.close();
      setLoading(false);
    };

    setTimeout(() => {
      eventSource.close();
      setLoading(false);
    }, 20000);

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* Profile Icon */}
      <div className="profile-container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          className="profile-icon"
          onClick={() => setProfileOpen(!profileOpen)}
        />
        {profileOpen && (
          <div className="profile-dropdown">
            <ul>
              <li>View Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="random">
          <ul>
            <li>Menu</li>
            <li>Home</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      {/* Chatbot UI */}
      <div className="chatbot">
        <div className="chat-header">Bridge AI</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Processing..." : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
