import React, { useState } from 'react';
import './AddComputer.css'; // For modal-specific styling

const API_BASE_URL = 'http://localhost:8000/api/data'; // Update if your server runs on a different URL or port

function AddComputer({ isOpen, onClose, onSubmit }) {
  const [computerName, setComputerName] = useState('');
  const [message, setMessage] = useState(''); // State for the success/error message

  const handleInputChange = (e) => {
    setComputerName(e.target.value); // Update input field state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the computer name to the backend API
    try {
      const response = await fetch(`${API_BASE_URL}/computer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_name: computerName }),
      });

      const result = await response.json();

      // Update the message based on the result
      if (response.ok) {
        setMessage(result.message || 'Success!');
        onSubmit(computerName); // Pass the computer name to the parent if successful
        setComputerName(''); // Reset input field
        onClose(); // Close the modal
      } else {
        setMessage('Error adding computer');
      }
    } catch (error) {
      setMessage('Error adding computer');
      console.error(error);
    }
  };

  if (!isOpen) return null; // Do not render modal if not open

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Computer</h2>
        <form onSubmit={handleSubmit} id="computerForm">
          <input
            type="text"
            id="device_name"
            value={computerName}
            onChange={handleInputChange}
            placeholder="Enter computer name"
            required
          />
          <button type="submit" className="black-button">Submit</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </form>
        <p id="computerResult">{message}</p>
      </div>
    </div>
  );
}

export default AddComputer;
