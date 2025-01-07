// white list for tables
const allowedTables = [
    'experiment', 'run', 'barcode', 'user',
    'computer', 'library_prep', 'minion',
    'operator', 'participant', 'sample', 'sequencing_unit'
];

const validateTable = (req, res, next) => {
    const { tableName } = req.params;
    if (!allowedTables.includes(tableName)) {
        return res.status(400).send({ error: 'Invalid table name' });
    }
    next();
};

module.exports = validateTable;
