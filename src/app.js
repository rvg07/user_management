const express = require('express');
const apiRoutes = require('./routes/index');
const app = express();

//parse each body request
app.use(express.json());

//mount the apis routes under /api/v1 | main entry point
app.use('/api/v1', apiRoutes);

//handling api errors
app.use((err, req, res, next) => {
    let statusCode = err.status || 500;
    let errorMessage = err.message || 'Internal Server Error';
    console.error(err.stack);
    res.status(statusCode).json({
        status: "error",
        message: errorMessage
    });
});

module.exports = app;