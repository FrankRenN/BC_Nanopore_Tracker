const { queryTable, deleteFromTable, insertData, editTable } = require('../models/tableModel');

const db = require('../models/db');

// query by pages
const getPaginatedData = async (req, res, next) => {
    const { tableName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : null;

    try {
        let sql = `SELECT * FROM ?? LIMIT ? OFFSET ?`;
        let params = [tableName, limit, offset];

        if (search) {
            sql = `SELECT * FROM ?? WHERE CONCAT_WS(' ', ${await getColumnNames(tableName)}) LIKE ? LIMIT ? OFFSET ?`;
            params = [tableName, search, limit, offset];
        }

        const [data] = await db.query(sql, params);
        res.status(200).send(data);
    } catch (err) {
        next(err);
    }
};

const getColumnNames = async (tableName) => {
    const [columns] = await db.query(`SHOW COLUMNS FROM ??`, [tableName]);
    return columns.map(col => col.Field).join(', ');
};

// delete data
const deleteData = async (tableName, id) => {
    const sql = `DELETE FROM ?? WHERE id = ?`;

    try {
        const [results] = await db.query(sql, [tableName, id]);
        return results;
    } catch (error) {
        console.error(`SQL Error: ${error.message}`);
        throw new Error(`Failed to delete record from ${tableName}`);
    }
};

//create new run
const createRun = async (date_run_start, experiment_id, computer, minion, notes) => {
    return await insertData('run', {
        date_run_start,
        experiment_id,
        computer,
        minion,
        notes,
    });
};

//create new experiment
const createExperiment = async (name, protocol, metadata, date_started, description) => {
    return await insertData('experiment', {
        name,
        protocol,
        metadata,
        date_started,
        description,
    });
};

//add new computer to the list
const addComputer = async (device_name) => {
    return await insertData('computer', {
        device_name,
    });
};

//add new minion to the list
const addMinion = async (name, computer_used, device_date, notes) => {
    return await insertData('minion', {
        name,
        computer_used,
        device_date,
        notes,
    });
};

const editRecord = async (tableName, id, fields) => {
    return await editTable(tableName, id, fields);
};

module.exports = {
    getPaginatedData, deleteData, createRun, createExperiment, addComputer, addMinion, editRecord
};
