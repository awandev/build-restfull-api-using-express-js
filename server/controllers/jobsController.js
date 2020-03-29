// import model
const Job = require('../models/jobsModel')
const geoCoder = require('../utils/geocoder')
// get all jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    res.status(200).json({
        success : true,
        results : jobs.length,
        data: jobs
        // requestMethod : req.requestMethod,
        // message : 'Halaman Jobs'
    });
}

// // create a new job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
    
    const job = await Job.create(req.body);
    
    res.status(200).json({
        success : true,
        message : 'Job Createdss',
        data : job
    });
}

exports.getJob = async( req, res, next) => {
    const job = await Job.find({$and: [{_id : req.params.id},{slug: req.params.slug}]});
    if(!job || job.length === 0) {
        return res.status(404).json({
            success : false,
            message : 'Job not found'
        });
    }

    res.status(200).json({
        success : true,
        data : job
    });
}

exports.updateJob = async(req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({
            success : false,
            message : 'Job not found'
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success : true,
        message : 'Job is updated',
        data : job
    })
}

exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({
            success : false,
            message : 'Job not found'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success : true,
        message : 'Job id delete'
    })
}

exports.getJobsInRadius = async(req, res, next) => {
    const { zipcode, distance } = req.params;

    // getting latitude & longitude from geocoder with zipcode 
    const loc = await geoCoder(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;
    const radius = distance / 3963;
    const jobs =     await Job.find({
        location : {$geoWithin : {$centerSphere: [[longitude,latitude], radius]}}
    });

    res.status(200).json({
        success : true,
        results : jobs.length,
        data : jobs
    })
}
