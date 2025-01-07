# BC_Nanopre_Tracker

This project is a server-side application designed to manage data for a laboratory database. It uses Node.js, Express.js, and MySQL to provide endpoints for CRUD operations on various database tables.

Features

Pagination and Search: Retrieve data from tables with support for pagination and search functionality.

Dynamic Table Validation: Ensures that only operations on allowed tables are processed.

CRUD Operations:

Create: Add new experiments, runs, computers, or minions.

Read: Fetch data with optional pagination and search.

Update: Modify existing records.

Delete: Remove records by ID.

Error Handling: Centralized error handling for consistent API responses.

Environment Configuration: Secure configuration using environment variables.

Project Structure

project-root
├── controllers
│   └── dbController.js   # Handles database operations
├── middlewares
│   └── validateTable.js  # Middleware to validate table names
├── models
│   ├── db.js             # Database connection setup
│   └── tableModel.js     # Database query models
├── routes
│   └── dataRoutes.js     # API route definitions
├── .env                  # Environment variables
├── app.js                # Application entry point
└── package.json          # Project dependencies and scripts

Getting Started

Prerequisites

Node.js (v14 or higher)

MySQL database

Installation

Clone the repository:

git clone <repository-url>
cd <repository-folder>

Install dependencies:

npm install

Configure the environment variables in a .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=labdatabase
PORT=8000

Set up the MySQL database with the necessary tables and data.

Running the Application

Start the server:

npm start

The server will be running at http://localhost:8000.

API Endpoints

Base URL: /api/data

Method

Endpoint

Description

GET

/:tableName

Fetch paginated data for a table.

DELETE

/delete/:tableName/:id

Delete a record by ID.

POST

/run

Add a new run record.

POST

/experiment

Add a new experiment record.

POST

/computer

Add a new computer record.

POST

/minion

Add a new minion record.

PUT

/:tableName/:id

Update a record by ID.

Example Request

Fetch Paginated Data:

GET /api/data/experiment?page=1&limit=10

Response:

[
  {
    "id": 1,
    "name": "Experiment 1",
    "protocol": "Protocol A",
    "metadata": "{}",
    "date_started": "2025-01-01",
    "description": "Test experiment."
  },
  ...
]

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contributing

Contributions are welcome! Please submit a pull request or open an issue to suggest improvements or report bugs.

Contact

For questions or feedback, please contact [Your Name] at [Your Email].
