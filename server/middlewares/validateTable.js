// Whitelist of allowed table names
const allowedTables = [
    'experiment', 'run', 'barcode', 'user',
    'computer', 'library_prep', 'minion',
    'operator', 'participant', 'sample',
    'sequencing_unit'                             
];

/**
 * Middleware function to validate table names in the request parameters
 * Ensures that only whitelisted tables are accessible
 */
const validateTable = (req, res, next) => {
    const { tableName } = req.params; // Extract table name from request parameters
    if (!allowedTables.includes(tableName)) {
        // If the table name is not in the whitelist, return a 400 Bad Request response
        return res.status(400).send({ error: 'Invalid table name' });
    }
    next(); // Proceed to the next middleware or route handler if the table name is valid
};

module.exports = validateTable; // Export the middleware for use in routes
