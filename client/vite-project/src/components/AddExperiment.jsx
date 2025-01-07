import React, { useState } from 'react';
import './AddExperiment.css';

const API_BASE_URL = 'http://localhost:8000/api/data'; // Update if your server runs on a different URL or port

function AddExperiment({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    protocol: '',
    metadata: '',
    date_started: '',
    description: '',
  });
  const [message, setMessage] = useState(''); // State for success/error message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/experiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Update the message based on the result
      if (response.ok) {
        setMessage(result.message || 'Experiment added successfully!');
        onSubmit(formData); // Pass data to the parent if needed
        setFormData({
          name: '',
          protocol: '',
          metadata: '',
          date_started: '',
        }); // Reset form
        onClose(); // Close the modal
      } else {
        setMessage(result.message || 'Error adding experiment');
      }
    } catch (error) {
      setMessage('Error adding experiment');
      console.error(error);
    }
  };

  if (!isOpen) return null; // Do not render modal if not open

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Experiment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Experiment Name"
            required
          />
          <input
            type="text"
            name="protocol"
            value={formData.protocol}
            onChange={handleInputChange}
            placeholder="Protocol"
            required
          />
          <input
            type="text"
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            placeholder="Metadata"
            required
          />
          <input
            type="date"
            name="date_started"
            value={formData.date_started}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows="4"
            required
          ></textarea>
          <div className="button-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button type="button" className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AddExperiment;