# BC_Nanopore_Tracker


This project was developed as part of an academic initiative, where I took primary responsibility for designing and implementing the backend architecture and integrating the database. The goal was to create a scalable and efficient system for managing laboratory data, including experiments, runs, devices, and participants. Leveraging Node.js, Express.js, and MySQL, the backend delivers robust CRUD functionality and seamless database interactions. In this documentation, I will primarily focus on explaining the functionality and usage of the backend code.

## Features

-   **Pagination and Search**: Retrieve data from tables with support for pagination and search functionality.
    
-   **Dynamic Table Validation**: Ensures that only operations on allowed tables are processed.
    
-   **CRUD Operations**:
    
    -   Create: Add new experiments, runs, computers, or minions.
        
    -   Read: Fetch data with optional pagination and search.
        
    -   Update: Modify existing records.
        
    -   Delete: Remove records by ID.
        
-   **Error Handling**: Centralized error handling for consistent API responses.
    
-   **Environment Configuration**: Secure configuration using environment variables.
    

## Project Structure

```
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
```

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
    
-   MySQL database
    

### Installation

1.  Clone the repository:
    
    ```
    git clone <https://github.com/FrankRenN/BC_Nanopre_Tracker>
    cd <repository-folder>
    ```
    
2.  Install dependencies:
    
    ```
    npm install
    ```
    
3.  Configure the environment variables in a `.env` file:
    
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=labdatabase
    PORT=8000
    ```
    
4.  Set up the MySQL database with the necessary tables and data.
    

### Running the Application

1.  Start the server:
    
    ```
    node app.js
    ```
    
2.  The server will be running at `http://localhost:8000`.
    

### API Endpoints

#### Base URL: `/api/data`

Method

Endpoint

Description

GET

`/:tableName`

Fetch paginated data for a table.

DELETE

`/delete/:tableName/:id`

Delete a record by ID.

POST

`/run`

Add a new run record.

POST

`/experiment`

Add a new experiment record.

POST

`/computer`

Add a new computer record.

POST

`/minion`

Add a new minion record.

PUT

`/:tableName/:id`

Update a record by ID.

### Example Request

**Fetch Paginated Data:**

```
GET /api/data/experiment?page=1&limit=10
```

Response:

```
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
```

## File Information

-   **File Name**: `labdatabase_localhost-2025_01_07_15_12_59-dump.sql`
    
-   **Database Type**: MySQL
    
-   **Purpose**: To provide a preconfigured schema and sample data for use with the Lab Database Management System.
    

## Tables Included

1.  `**experiment**`: Stores information about experiments.
    
2.  `**run**`: Tracks individual runs of experiments.
    
3.  `**computer**`: Maintains a list of computers used in experiments.
    
4.  `**minion**`: Represents auxiliary devices or tools used in experiments.
    
5.  `**participant**`: Holds data on participants involved in experiments.
    
6.  **Additional tables as needed**: Includes related data for operations.
    

## How to Use

### Prerequisites

-   MySQL server installed and running.
    
-   Access to a database user with the required permissions to create databases and tables.
    

### Importing the Database

1.  **Create a new database**:
    
    ```
    CREATE DATABASE labdatabase;
    ```
    
2.  **Import the SQL dump**:
    
    ```
    mysql -u <username> -p labdatabase < labdatabase_localhost-2025_01_07_15_12_59-dump.sql
    ```
    
3.  **Verify the data**:
    
    ```
    USE labdatabase;
    SHOW TABLES;
    ```

**Or you can use any other tools to import the sql file to the local database**

## Database Schema Overview

The database is structured to support operations like:

-   **Experiment Management**: Create, update, and manage experiments.
    
-   **Run Tracking**: Log details for each run of an experiment.
    
-   **Device Integration**: Track computers and other devices used in the experiments.
    
-   **Participant Records**: Maintain participant involvement data.
    

## Notes

-   Ensure that the database credentials in your application match those in the `.env` file or the database connection settings.
    
-   Backup your database before making changes to prevent data loss.
    

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to suggest improvements or report bugs.

## Contact

For questions or feedback, please contact me at renfeng0520@gmail.com.
