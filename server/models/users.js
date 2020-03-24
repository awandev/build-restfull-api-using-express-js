const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userScheme = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please enter your name']
    },
    email : {
        type: String,
        required : [true, 'Please enter your email'],
        unique : true,
        validate : [validator.isEmail, 'please enter valid email']
    },
    role : {
        type : String,
        enum : {
            values : ['user','employeer'],
            message : 'Please select correct role'
        },
        default : 'user'
    },
    password : {
        type : String,
        required : [true, 'Please enter password for your account'],
        minlength : [8, 'Your password must be at least 8 characters long'],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    resetPasswordToken : String,
    resetPasswordExpire: Date

});


// encrypting passwords before saving
userScheme.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
});

module.exports = mongoose.model('User', userScheme);