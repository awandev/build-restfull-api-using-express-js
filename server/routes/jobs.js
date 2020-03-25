const express = require('express')
const router = express.Router();

// importing jobs controller methods
const { 
    getJob,
    getJobs, 
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    jobStats
} = require('../controllers/jobsController');

const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth')

router.route('/jobs').get(getJobs);
router.route('/job/:id/:slug').get(getJob);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
router.route('/stats/:topic').get(jobStats);
router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employeer','admin'),newJob);
router.route('/job/:id')
        .put(isAuthenticatedUser,updateJob)
        .delete(isAuthenticatedUser,deleteJob);

module.exports = router;