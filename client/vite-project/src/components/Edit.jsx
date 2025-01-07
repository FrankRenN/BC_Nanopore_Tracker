import React, { useState, useEffect } from 'react';
import './Edit.css';

const Edit = ({ row, onSave, onCancel }) => {
  const [editedRow, setEditedRow] = useState(row);

  // Update state when row prop changes
  useEffect(() => {
      setEditedRow(row);
  }, [row]);

  const handleInputChange = (e, key) => {
      setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  return (
      <tr className="edit-row">
          {Object.entries(editedRow).map(([key, value]) => (
              <td key={key}>
                  <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, key)}
                      className="edit-input"
                  />
              </td>
          ))}
          <td>
              <button onClick={() => onSave(editedRow)} className="save-button">Save</button>
              <button onClick={onCancel} className="cancel-button">Cancel</button>
          </td>
      </tr>
  );
};

export default Edit;