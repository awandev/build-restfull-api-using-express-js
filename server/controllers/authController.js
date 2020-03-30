const User = require('../models/usersModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
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