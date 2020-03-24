const User = require('../models/users');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
// register a new user => /api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next) => {
    const {name,email,password,role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({
        success : true,
        message : 'User is registered.',
        data : user
    });
});
