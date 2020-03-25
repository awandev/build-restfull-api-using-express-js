const User = require('../models/users');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
// register a new user => /api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next) => {
    const {name,email,password,role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // create JWT token
    const token = user.getJwtToken();
    console.log(token);
    res.status(200).json({
        success : true,
        message : 'User is registeredsdf.',
        token : token
    });
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

    // create json web token
    const token = user.getJwtToken();

    res.status(200).json({
        success: false,
        token
    })

});