const express = require('express')
const router = express.Router();

// importing jobs controller methods
const { getJobs } = require('../controllers/jobsController');


router.route('/jobs').get(getJobs);

module.exports = router;