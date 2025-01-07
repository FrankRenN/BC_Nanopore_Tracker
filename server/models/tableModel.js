const db = require('./db');

//query table
const queryTable = async (tableName, limit, offset) => {
    const sql = `SELECT * FROM ?? LIMIT ? OFFSET ?`;
    const [results] = await db.query(sql, [tableName, limit, offset]);
    return results;
};

// delete data
const deleteFromTable = async (tableName, id) => {
    const sql = `DELETE FROM ?? WHERE id = ?`;
    const [results] = await db.query(sql, [tableName, id]);
    return results;
};

//insert data
const insertData = async (tableName, fields) => {
    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields);

    const sql = `
        INSERT INTO ${tableName} (${columns}) 
        VALUES (${placeholders})
    `;

    try {
        const [result] = await db.query(sql, values);
        return {
            success: true,
            insertId: result.insertId,
            message: `${tableName} record created successfully`,
        };
    } catch (error) {
        console.error(`Error creating record in ${tableName}:`, error);
        throw new Error(`Failed to create record in ${tableName}`);
    }
};

const editTable = async (tableName, id, fields) => {
    if (!fields || Object.keys(fields).length === 0) {
        throw new Error('No fields provided for update');
    }
    const updates = Object.keys(fields)
        .map((field) => `${field} = ?`)
        .join(', ');

    const values = Object.values(fields);
    const sql = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;

    try {
        const [result] = await db.query(sql, [...values, id]);
        return {
            success: true,
            affectedRows: result.affectedRows,
            message: `${tableName} record updated successfully`,
        };
    } catch (error) {
        console.error(`Error updating record in ${tableName}:`, error);
        throw new Error(`Failed to update record in ${tableName}`);
    }
};


module.exports = { queryTable, deleteFromTable, insertData, editTable};
