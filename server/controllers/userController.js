const User = require('../models/usersModel')
const Job = require('../models/jobsModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const fs = require('fs');

const APIFilters = require('../utils/apiFilters');


// get current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id)
    .populate({
        path : 'jobsPublished',
        select : 'title postingDate'
    });
    res.status(200).json({
        success: true,
        data: user
    })
});


// update current user password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req,res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    console.log(user);
    // check previous user password
    const isMatched = await user.comparePassword(req.body.currentPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
})

// update current user data => /api/v1/me/update
exports.updateUser = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators: true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true,
        data : user
    })
});


// Show all applied jobs   =>   /api/v1/jobs/applied
exports.getAppliedJobs = catchAsyncErrors( async (req, res, next) => {
    // console.log(req.user.id);
    const jobs = await Job.find({'applicantsApplied.id' : req.user.id}).select('+applicantsApplied');
    console.log(jobs);
    res.status(200).json({
        success : true,
        results : jobs.length,
        data : jobs
    })
});

// show all jobs published by employeer => /api/v1/jobs/published
exports.getPublishedJobs = catchAsyncErrors(async(req, res, next) => {
    const jobs = await Job.find({user: req.user.id});
    res.status(200).json({
        success : true,
        results : jobs.length,
        data : jobs
    })
})



// delete current user => /api/v1/me/delete
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {

    deleteUserData(req.user.id, req.user.role);
    const user = await User.findByIdAndDelete(req.user.id)

    res.cookie('token','none', {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success : true,
        message : 'your account has been delete'
    })
    
})


// show all user => /api/v1/users
exports.getUsers = catchAsyncErrors(async(req, res, next) => {
    const apiFilters = new APIFilters(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

    const users = await apiFilters.query;

    res.status(200).json({
        success : true,
        results : users.length,
        data : users
    }) 
})



// delete user (admin) => /api/v1/user/:id
exports.deleteUserAdmin = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    deleteUserData(user.id, user.role);
    user.remove();

    res.status(200).json({
        success : true,
        message : 'User is deleted by admin'
    });
})


async function deleteUserData(user, role) {
    if(role === 'employeer') {
        await Job.deleteMany({user : user});
    }

    if(role === 'user') {
        const appliedJobs = await Job.find({'applicantsApplied.id' : user}).select('+applicantsApplied');

        for(let i=0; i<appliedJobs.length; i++) {
            let obj = appliedJobs[i].applicantsApplied.find(o => o.id === user);

            let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace('\\controllers', '');

            fs.unlink(filepath, err => {
                if(err) return console.log(err);
            });

            appliedJobs[i].applicantsApplied.splice(appliedJobs[i].applicantsApplied.indexOf(obj.id));

            appliedJobs[i].save();
        }
    }
}