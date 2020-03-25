const User = require('../models/users');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
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