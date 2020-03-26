const User = require('../models/users');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// register a new user => /api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next) => {
    const {name,email,password,role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendToken(user, 200, res);
});


// for login user => /api/v1/login
exports.loginUser = catchAsyncError(async(req, res, next) => {
    const { email, password } = req.body;

    // check if email or password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & Password'),404);
    }

    // finding user in database
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password.', 401))
    }

    // check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);

});

// forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findOne({email:req.body.email});

    // check user email is database
    if(!user) {
        return next(new ErrorHandler('No user found with this email', 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that`

    try {
        await sendEmail({
            email : user.email,
            subject : 'awandevAPI password recovery',
            message
        });
    
        res.status(200).json({
            success : true,
            message: `Email sent successfully to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});
        return next(new ErrorHandler('EMail is not sent'),500)
    }
})

// reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req, res, next) => {
    // hash url token
    const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
    
    const user = await User.findOne({ 
            resetPasswordToken,
            resetPasswordExpire: {$gt : Date.now()}
    });

    if (!user) {
        return next(new ErrorHandler('Password Reset token is invalid', 400));
    }

    // setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);

});