// routes/dataRoutes.js
const express = require('express');
const { getPaginatedData, deleteData, createRun, createExperiment, addComputer, addMinion, editRecord } = require('../controllers/dbController');
const validateTable = require('../middlewares/validateTable');

const router = express.Router();

router.get('/:tableName', validateTable, getPaginatedData); // query by pages

router.delete('/delete/:tableName/:id', validateTable, async (req, res) => {
    const { tableName, id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send({ success: false, message: 'Invalid ID provided' });
    }

    try {
        const result = await deleteData(tableName, id);
        if (result.affectedRows > 0) {
            res.status(200).send({ success: true, message: `Deleted ID ${id} from ${tableName}` });
        } else {
            res.status(404).send({ success: false, message: `Record with ID ${id} not found in ${tableName}` });
        }
    } catch (err) {
        console.error(`Error deleting data: ${err.message}`);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

// Create router for "run"
router.post('/run', async (req, res) => {
    try {
        const { date_run_start, experiment_id, computer, minion, notes } = req.body;
        const result = await createRun(date_run_start, experiment_id, computer, minion, notes);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating run:', error);
        res.status(500).send({ success: false, message: 'Failed to create run' });
    }
});

// Create router for "experiment"
router.post('/experiment', async (req, res) => {
    try {
        const { name, protocol, metadata, date_started, description } = req.body;
        const result = await createExperiment(name, protocol, metadata, date_started, description);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating experiment:', error);
        res.status(500).send({ success: false, message: 'Failed to create experiment' });
    }
});

// Create router for adding a computer
router.post('/computer', async (req, res) => {
    const { device_name } = req.body;

    if (!device_name) {
        return res.status(400).send({ success: false, message: 'Device name is required' });
    }

    try {
        const result = await addComputer(device_name);
        res.status(201).send({
            success: true,
            message: 'Computer added successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error adding computer:', error);
        res.status(500).send({ success: false, message: 'Failed to add computer' });
    }
});

// Create router for adding a minion
router.post('/minion', async (req, res) => {
    const { name, computer_used, device_date, notes } = req.body;

    // Validate fields
    if (!name || !computer_used || !device_date || !notes) {
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    try {
        const result = await addMinion(name, computer_used, device_date, notes);
        res.status(201).send({
            success: true,
            message: 'Minion added successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error adding minion:', error);
        res.status(500).send({ success: false, message: 'Failed to add minion' });
    }
});

// Update a record in the table
router.put('/:tableName/:id', validateTable, async (req, res) => {
    try {
        const { tableName, id } = req.params;
        const fields = req.body;

        if (!fields || Object.keys(fields).length === 0) {
            return res.status(400).send({
                success: false,
                message: 'No fields provided for update',
            });
        }

        const result = await editRecord(tableName, id, fields);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to update record',
        });
    }
});

module.exports = router;
