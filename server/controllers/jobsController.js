const Job = require('../models/jobs')


// get all jobs => /api/v1/jobs
exports.getJobs = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'This route will display all jobs in future'
    });
} 


// create a new job => /api/v1/job/new
exports.newJob = async(req, res, next) => { 
    const job = await Job.create(req.body);
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: 'Job created.',
        data: job
    });

}