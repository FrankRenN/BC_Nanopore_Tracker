const db = require('./db'); // Import the database connection module

// Query data from a table with pagination
const queryTable = async (tableName, limit, offset) => {
    // SQL query to select all rows with pagination
    const sql = `SELECT * FROM ?? LIMIT ? OFFSET ?`;
    const [results] = await db.query(sql, [tableName, limit, offset]); // Use placeholders for table name and limits
    return results; // Return the queried results
};

// Delete a specific record from a table by ID
const deleteFromTable = async (tableName, id) => {
    // SQL query to delete a record based on its ID
    const sql = `DELETE FROM ?? WHERE id = ?`;
    const [results] = await db.query(sql, [tableName, id]); // Use placeholders for table name and ID
    return results; // Return the result of the deletion
};

// Insert a new record into a table
const insertData = async (tableName, fields) => {
    // Extract column names and generate placeholders for values
    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields); // Extract field values

    // SQL query to insert a new record
    const sql = `
        INSERT INTO ${tableName} (${columns}) 
        VALUES (${placeholders})
    `;

    try {
        const [result] = await db.query(sql, values); // Execute the query with provided values
        return {
            success: true, // Indicate success
            insertId: result.insertId, // Return the ID of the inserted record
            message: `${tableName} record created successfully`, // Success message
        };
    } catch (error) {
        console.error(`Error creating record in ${tableName}:`, error); // Log error
        throw new Error(`Failed to create record in ${tableName}`); // Throw an error for the caller
    }
};

// Update a specific record in a table by ID
const editTable = async (tableName, id, fields) => {
    if (!fields || Object.keys(fields).length === 0) {
        // Validate if fields are provided for updating
        throw new Error('No fields provided for update');
    }

    // Generate the SQL query for updating with placeholders
    const updates = Object.keys(fields)
        .map((field) => `${field} = ?`)
        .join(', ');

    const values = Object.values(fields); // Extract the values to update
    const sql = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;

    try {
        const [result] = await db.query(sql, [...values, id]); // Execute the update query
        return {
            success: true, // Indicate success
            affectedRows: result.affectedRows, // Return the number of rows affected
            message: `${tableName} record updated successfully`, // Success message
        };
    } catch (error) {
        console.error(`Error updating record in ${tableName}:`, error); // Log error
        throw new Error(`Failed to update record in ${tableName}`); // Throw an error for the caller
    }
};

module.exports = { queryTable, deleteFromTable, insertData, editTable }; // Export the model functions
