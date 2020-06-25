const express = require('express');
const path = require('path');
const router = express.Router();
const processSubwayData = require('./subway');

router.get('/api/subway', processSubwayData);

//make sure index.html is send if root route is accessed
router.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = router;