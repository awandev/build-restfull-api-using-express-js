const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')

// get all jobs => /api/v1/jobs
exports.getJobs = async(req, res, next) => {

    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data : jobs
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

// search jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // getting latitude & longitude from geocoder with zipcode
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;
    
    const radius = distance / 3963;

    const jobs = await Job.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]
        }}
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data : jobs
    });

};
