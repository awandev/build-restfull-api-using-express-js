const User = require('../models/usersModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
// register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password , role} = req.body;
    const user = await User.create({
        name,
        email,
        password, 
        role
    });
    // create jwt token
    const token = user.getJwtToken();

 

    sendToken(user, 200, res);
});

// login user => /api/v1/login
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    // check if email or password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email or password'), 400)
    }

    // finding user in database
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // create JSON Web Token
    sendToken(user, 200, res);
}

exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
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
        // console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});
        return next(new ErrorHandler(error),500)
    }

    

});

// reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {
    // hash url token
    const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
    
    const user = await User.findOne({ 
        resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorHandler('Password Reset token is invalid.', 400));
    }

    // setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});


// logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async(req, res, next) => {
    res.cookie('token','none', {
        expires: new Date(Date.now()),
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        message : 'Logout successfully'
    });
});