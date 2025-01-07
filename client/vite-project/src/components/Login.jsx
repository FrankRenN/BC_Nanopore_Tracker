import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/BC_Logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from JSON file
    fetch('/users.json')
      .then(response => response.json())
      .then(data => setUsers(data.users))
      .catch(error => console.error('Error loading users:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Find user in the loaded users array
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Successful login
      navigate("/home");
    } else {
      // Failed login
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Login Logo" className="login-image" />
      <h2>BC Nanopore Tracker</h2>
      <p>For authorized staff ONLY</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
