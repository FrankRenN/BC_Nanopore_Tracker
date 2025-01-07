const { queryTable, deleteFromTable, insertData, editTable } = require('../models/tableModel'); // Import model functions
const db = require('../models/db'); // Import the database connection

// Query paginated data from a specific table
const getPaginatedData = async (req, res, next) => {
    const { tableName } = req.params; // Extract table name from the request parameters
    const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10 if not provided
    const offset = (page - 1) * limit; // Calculate the offset for pagination
    const search = req.query.search ? `%${req.query.search}%` : null; // Search query if provided

    try {
        let sql = `SELECT * FROM ?? LIMIT ? OFFSET ?`; // Base SQL query
        let params = [tableName, limit, offset]; // Parameters for the query

        if (search) {
            // Update SQL query to include search functionality
            sql = `SELECT * FROM ?? WHERE CONCAT_WS(' ', ${await getColumnNames(tableName)}) LIKE ? LIMIT ? OFFSET ?`;
            params = [tableName, search, limit, offset];
        }

        const [data] = await db.query(sql, params); // Execute the query
        res.status(200).send(data); // Send the results as a response
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

// Retrieve all column names from a specific table
const getColumnNames = async (tableName) => {
    const [columns] = await db.query(`SHOW COLUMNS FROM ??`, [tableName]); // Get column metadata
    return columns.map(col => col.Field).join(', '); // Return column names as a comma-separated string
};

// Delete a record from a specific table by ID
const deleteData = async (tableName, id) => {
    const sql = `DELETE FROM ?? WHERE id = ?`; // SQL query to delete a record

    try {
        const [results] = await db.query(sql, [tableName, id]); // Execute the query
        return results; // Return the result of the deletion
    } catch (error) {
        console.error(`SQL Error: ${error.message}`); // Log the error
        throw new Error(`Failed to delete record from ${tableName}`); // Throw an error for the caller
    }
};

// Create a new run entry in the 'run' table
const createRun = async (date_run_start, experiment_id, computer, minion, notes) => {
    return await insertData('run', {
        date_run_start,
        experiment_id,
        computer,
        minion,
        notes,
    }); // Use the insertData function to add a new run
};

// Create a new experiment entry in the 'experiment' table
const createExperiment = async (name, protocol, metadata, date_started, description) => {
    return await insertData('experiment', {
        name,
        protocol,
        metadata,
        date_started,
        description,
    }); // Use the insertData function to add a new experiment
};

// Add a new computer entry to the 'computer' table
const addComputer = async (device_name) => {
    return await insertData('computer', {
        device_name,
    }); // Use the insertData function to add a new computer
};

// Add a new minion entry to the 'minion' table
const addMinion = async (name, computer_used, device_date, notes) => {
    return await insertData('minion', {
        name,
        computer_used,
        device_date,
        notes,
    }); // Use the insertData function to add a new minion
};

// Edit a record in a specific table by ID
const editRecord = async (tableName, id, fields) => {
    return await editTable(tableName, id, fields); // Use the editTable function to update the record
};

// Export all functions for use in other parts of the application
module.exports = {
    getPaginatedData, 
    deleteData, 
    createRun, 
    createExperiment, 
    addComputer, 
    addMinion, 
    editRecord
};
