// routes/dataRoutes.js
const express = require('express');
const { 
    getPaginatedData, 
    deleteData, 
    createRun, 
    createExperiment, 
    addComputer, 
    addMinion, 
    editRecord 
} = require('../controllers/dbController'); // Import controller functions for database operations
const validateTable = require('../middlewares/validateTable'); // Middleware to validate table names

const router = express.Router();

router.get('/:tableName', validateTable, getPaginatedData); // Route to fetch paginated data from a specific table

router.delete('/delete/:tableName/:id', validateTable, async (req, res) => {
    // Route to delete a specific record from a table
    const { tableName, id } = req.params;

    if (isNaN(id)) { 
        // Check if the provided ID is a valid number
        return res.status(400).send({ success: false, message: 'Invalid ID provided' });
    }

    try {
        const result = await deleteData(tableName, id); // Call deleteData function
        if (result.affectedRows > 0) {
            // If deletion is successful, send success response
            res.status(200).send({ success: true, message: `Deleted ID ${id} from ${tableName}` });
        } else {
            // If record is not found, send a 404 response
            res.status(404).send({ success: false, message: `Record with ID ${id} not found in ${tableName}` });
        }
    } catch (err) {
        // Log the error and send a 500 response for server issues
        console.error(`Error deleting data: ${err.message}`);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

// Route to create a new run entry
router.post('/run', async (req, res) => {
    try {
        const { date_run_start, experiment_id, computer, minion, notes } = req.body; // Destructure the request body
        const result = await createRun(date_run_start, experiment_id, computer, minion, notes); // Call createRun function
        res.status(201).send(result); // Send success response
    } catch (error) {
        // Log the error and send a 500 response for server issues
        console.error('Error creating run:', error);
        res.status(500).send({ success: false, message: 'Failed to create run' });
    }
});

// Route to create a new experiment entry
router.post('/experiment', async (req, res) => {
    try {
        const { name, protocol, metadata, date_started, description } = req.body; // Destructure the request body
        const result = await createExperiment(name, protocol, metadata, date_started, description); // Call createExperiment function
        res.status(201).send(result); // Send success response
    } catch (error) {
        // Log the error and send a 500 response for server issues
        console.error('Error creating experiment:', error);
        res.status(500).send({ success: false, message: 'Failed to create experiment' });
    }
});

// Route to add a new computer
router.post('/computer', async (req, res) => {
    const { device_name } = req.body; // Destructure the request body

    if (!device_name) {
        // Check if device_name is provided in the request
        return res.status(400).send({ success: false, message: 'Device name is required' });
    }

    try {
        const result = await addComputer(device_name); // Call addComputer function
        res.status(201).send({
            success: true,
            message: 'Computer added successfully',
            data: result,
        }); // Send success response
    } catch (error) {
        // Log the error and send a 500 response for server issues
        console.error('Error adding computer:', error);
        res.status(500).send({ success: false, message: 'Failed to add computer' });
    }
});

// Route to add a new minion
router.post('/minion', async (req, res) => {
    const { name, computer_used, device_date, notes } = req.body; // Destructure the request body

    if (!name || !computer_used || !device_date || !notes) {
        // Validate if all required fields are present
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    try {
        const result = await addMinion(name, computer_used, device_date, notes); // Call addMinion function
        res.status(201).send({
            success: true,
            message: 'Minion added successfully',
            data: result,
        }); // Send success response
    } catch (error) {
        // Log the error and send a 500 response for server issues
        console.error('Error adding minion:', error);
        res.status(500).send({ success: false, message: 'Failed to add minion' });
    }
});

// Route to update a record in a specific table
router.put('/:tableName/:id', validateTable, async (req, res) => {
    try {
        const { tableName, id } = req.params; // Extract parameters from the request
        const fields = req.body; // Get fields to be updated from the request body

        if (!fields || Object.keys(fields).length === 0) {
            // Validate if fields are provided
            return res.status(400).send({
                success: false,
                message: 'No fields provided for update',
            });
        }

        const result = await editRecord(tableName, id, fields); // Call editRecord function
        res.status(200).send(result); // Send success response
    } catch (error) {
        // Log the error and send a 500 response for server issues
        console.error('Error updating record:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to update record',
        });
    }
});

module.exports = router; // Export the router for use in the main application
