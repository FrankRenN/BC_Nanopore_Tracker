import React, { useState } from 'react';
import './Delete.css';

const Delete = ({ onDelete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (row) => {
        // Confirm deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        setIsLoading(true);
        setError(null); // Reset error state

        try {
            await onDelete(); // Call the onDelete prop function
            alert("Item deleted successfully!"); // Optional success message
        } catch (err) {
            setError("Failed to delete the item. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleDelete} className="delete-button" disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Delete;