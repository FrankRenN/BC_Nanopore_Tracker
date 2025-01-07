import React, { useState, useEffect } from 'react';
import Nav from "./Nav";
import Edit from './Edit';
import Delete from './Delete';
import './Query.css';

const Query = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [tableName, setTableName] = useState('experiment');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recordId, setRecordId] = useState(''); // For manual delete form

    const tables = [
        'experiment', 'run', 'barcode', 'computer', 'library_prep',
        'minion', 'operator', 'participant', 'sample', 'sequencing_unit'
    ];

    useEffect(() => {
        fetchData();
    }, [currentPage, tableName, keyword]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null); // Reset success message on new fetch
        try {
            let url = `http://localhost:8000/api/data/${tableName}?page=${currentPage}&limit=20`;
            if (keyword) {
                url += `&search=${encodeURIComponent(keyword)}`;
            }
            const response = await fetch(url);
            const result = await response.json();

            if (response.ok) {
                setData(result);
            } else {
                throw new Error(result.message || 'Error fetching data');
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handleTableChange = (e) => {
        setTableName(e.target.value);
        setCurrentPage(1);
        setKeyword('');
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handleEdit = (row) => {
        setEditingRow(row);
    };

    const handleSave = async (editedRow) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/data/${tableName}/${editedRow.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedRow),
            });
            if (response.ok) {
                setData(prevData => prevData.map(item => item.id === editedRow.id ? editedRow : item));
                setEditingRow(null);
                setSuccessMessage('Row updated successfully!');
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm('Are you sure you want to delete this row?')) {
            setIsLoading(true);
            try {
                const url = `http://localhost:8000/api/data/delete/${tableName}/${row.id}`;
                const response = await fetch(url, { method: 'DELETE' });
    
                // Check if the response is JSON
                if (response.ok) {
                    const result = await response.json();
                    setData(prevData => prevData.filter(item => item.id !== row.id));
                    setSuccessMessage('Row deleted successfully!');
                } else {
                    // Log the response text for debugging purposes
                    const text = await response.text();
                    console.error('Delete failed with status:', response.status);
                    console.error('Response text:', text);
                    throw new Error('Failed to delete row');
                }
            } catch (error) {
                setError(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };
    

    const handleManualDelete = async (e) => {
        e.preventDefault();

        // Get form values
        const tableName = document.getElementById('tableName').value;
        const recordId = document.getElementById('recordId').value;

        // Reset result message
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = '';

        if (!tableName || !recordId) {
            resultDiv.textContent = "Please provide both table name and record ID.";
            resultDiv.style.color = 'red';
            return;
        }

        setIsLoading(true);
        try {
            // Send DELETE request
            const response = await fetch(`http://localhost:8000/api/data/delete/${tableName}/${recordId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                resultDiv.textContent = result.message || 'Record deleted successfully';
                resultDiv.style.color = 'green';
                fetchData(); // Refresh data after deletion
            } else {
                resultDiv.textContent = result.message || 'Failed to delete record';
                resultDiv.style.color = 'red';
            }
        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.style.color = 'red';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <Nav />
            <h1 className="header">Database Query with Search</h1>
            
            <div className="controls">
                <div>
                    <label htmlFor="tableSelect">Select Table:</label>
                    <select id="tableSelect" value={tableName} onChange={handleTableChange} className="select">
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <input 
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter keyword to search"
                        className="input"
                    />
                    <button onClick={handleSearch} className="button">Search</button>
                </div>
            </div>

            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    {successMessage && <p className="success">{successMessage}</p>}
                    <div className="table-container">
                        <table className="query-table">
                            <thead>
                                <tr>
                                    {data.length > 0 && Object.keys(data[0]).map(key => (
                                        <th key={key} className="query-th">{key}</th>
                                    ))}
                                    <th className="query-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    editingRow === row ? (
                                        <Edit
                                            key={index}
                                            row={row}
                                            onSave={handleSave}
                                            onCancel={() => setEditingRow(null)}
                                        />
                                    ) : (
                                        <tr key={index}>
                                            {Object.values(row).map((value, idx) => (
                                                <td key={idx} className="query-td">{value}</td>
                                            ))}
                                            <td className="query-td">
                                                <button 
                                                    onClick={() => handleEdit(row)} 
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row)} 
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}


            <div className="pagination">
                <button onClick={handlePrevPage} className="pagination-button" disabled={currentPage === 1}>Previous Page</button>
                <span>Page: {currentPage}</span>
                <button onClick={handleNextPage} className="pagination-button">Next Page</button>
            </div>
        </div>
    );
};

export default Query;
