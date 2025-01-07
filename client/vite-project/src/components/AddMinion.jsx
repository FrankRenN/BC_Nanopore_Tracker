import React, { useState, useEffect } from 'react';
import './AddMinion.css'; // For modal-specific styling

const API_BASE_URL = 'http://localhost:8000/api/data'; // Update if your server runs on a different URL or port

function AddMinion({ isOpen, onClose, onSubmit }) {
  const [minionName, setMinionName] = useState('');
  const [computerUsed, setComputerUsed] = useState('');
  const [deviceDate, setDeviceDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [computers, setComputers] = useState([]); // To store list of computers

  // Fetch computers from the API when the modal opens
  useEffect(() => {
    const fetchComputers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/computer`);
        const data = await response.json();
        if (response.ok) {
          setComputers(data); // Set computers from response data
        } else {
          setMessage('Failed to load computers');
        }
      } catch (error) {
        console.error('Error fetching computers:', error);
        setMessage('Error fetching computers');
      }
    };

    if (isOpen) {
      fetchComputers();
    }
  }, [isOpen]); // Run the fetch when the modal is opened

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minionData = { name: minionName, computer_used: computerUsed, device_date: deviceDate, notes: notes };

    // Sending the minion data to the backend
    try {
      const response = await fetch(`${API_BASE_URL}/minion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Minion added successfully!');
        onSubmit(minionData); // If successful, pass the data to parent component
        setMinionName('');
        setComputerUsed('');
        setDeviceDate('');
        setNotes('');
        onClose(); // Close the modal
      } else {
        setMessage('Error adding minion');
      }
    } catch (error) {
      setMessage('Error adding minion');
      console.error(error);
    }
  };

  if (!isOpen) return null; // Do not render modal if not open

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Minion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={minionName}
            onChange={(e) => handleInputChange(e, setMinionName)}
            placeholder="Minion Name"
            required
          />
          {/* Dropdown for selecting Computer Used */}
          <select
            value={computerUsed}
            onChange={(e) => handleInputChange(e, setComputerUsed)}
            required
          >
            <option value="">Select a computer</option>
            {computers.map((computer) => (
              <option key={computer.id} value={computer.device_name}>
                {computer.device_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={deviceDate}
            onChange={(e) => handleInputChange(e, setDeviceDate)}
            required
          />
          <textarea
            value={notes}
            onChange={(e) => handleInputChange(e, setNotes)}
            placeholder="Notes"
            rows="4"
          />
          <button type="submit" className="black-button">Submit</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </form>
        {message && <p>{message}</p>} {/* Display message */}
      </div>
    </div>
  );
}

export default AddMinion;
