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


// get a single job with id and slug => /api/vi/job/:id/:slug
exports.getJob = async(req,res,next) => {
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
}



// update a job => /api/v1/job/:id
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    
    console.log(`idnya adalah ${req.params.id}`);
    
    if(!job) {
        return res.status(404).json({
            success: true,
            message: 'Job not found.'
        });
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


}


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
exports.deleteJob = async(req, res, next) => {
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
