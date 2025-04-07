// index.js is our main entry route points
const express = require('express');
const userRoutes = require('./userRoutes');
const groupRoutes = require('./groupRoutes');
const associationRoutes = require('./associationRoutes');
const apiRoutes = express.Router();

//we mount the users and groups routes
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/groups', groupRoutes);
apiRoutes.use('/associations', associationRoutes);


apiRoutes.get('/', (req, res) => {
    res.json({ success: 'success', message: 'Welcome!' });
});


module.exports = apiRoutes;