require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); // Import data-related routes

const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
    res.send({ message: 'API is running' });
});

// Mount data routes
app.use('/api/data', dataRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send({ error: 'Internal Server Error', message: err.message });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
