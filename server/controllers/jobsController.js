const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFilters = require('../utils/apiFilters');

// get all jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async(req, res, next) => {

    const apiFilters = new APIFilters(Job.find(), req.query).filter().sort();
    const jobs = await apiFilters.query;

    res.status(200).json({
        success: true,
        results: jobs.length,
        data : jobs
    });
}); 


// create a new job => /api/v1/job/new
exports.newJob = catchAsyncErrors(async(req, res, next) => { 
    const job = await Job.create(req.body);
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: 'Job created.',
        data: job
    });
});


// get a single job with id and slug => /api/vi/job/:id/:slug
exports.getJob = catchAsyncErrors(async(req,res,next) => {
    const job = await Job.find({$and: [{_id: req.params.id}, {slug:req.params.slug}]});
    if(!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }
    res.status(200).json({
        success: true,
        data: job
    })
});


// get stats about a topic (job) => /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors(async(req,res,next) => {
    const stats = await Job.aggregate([
        {
            $match : {$text : {$search : "\""+req.params.topic + "\""}}
        },
        {
            $group: {
                _id : null,
                totalJobs : {$sum: 1},
                avgPosition: {$avg: '$positions'},
                avgSalary: {$avg : '$salary'},
                minSalary: {$min : '$salary'},
                maxSalary: {$max : '$salary'}
            }
        }
    ]);

    if(stats.length === 0) {
        return res.status(404).json({
            success: false,
            message: `No stats found for ${req.params.topic}`
        })
    }

    res.status(200).json({
        success: true,
        data: stats
    });

});



// update a job => /api/v1/job/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    
    console.log(`idnya adalah ${req.params.id}`);
    
    if(!job) {
        return next(new ErrorHandler('Job Not Found', 404));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: 'Job is Updated.',
        data: job
    })


});


// exports.updateJobsById = async(req, res, next) => {
    
//     Exercise.findById(req.params.id)
//         .then(exercise => {
//             exercise.username = req.body.username;
//             exercise.description = req.body.description;
//             exercise.duration = Number(req.body.duration);
//             exercise.date = Date.parse(req.body.date);
//             exercise.save()
//                 .then(() => res.json('Exercise Updated!'))
//                 .catch(err => res.status(400).json('Error : ' + err));
//         })
//         .catch( err => res.status(400).json('Error : ' + err));
    
// }


// delete a job => /api/v1/job:id
exports.deleteJob = catchAsyncErrors(async(req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job Not Found'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Job Is Deleted'
    });

});



// search jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
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

});
