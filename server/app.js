const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

// connect to database 
const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler')

// setting up config.env file variables
dotenv.config({path: './config/config.env'})

// handling uncaught exception
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.')
    process.exit(1)
});

// connecting to database
connectDatabase();

// setup bodyparser
app.use(express.json());

// set cookie parser
app.use(cookieParser());

// handle file uploads
app.use(fileUpload())

// setup security helmet
app.use(helmet())


// rate limiting 
const limiter = rateLimit({
    windosMs : 10*60*1000, //10 minutes
    max : 2 , //it means, you only have 2 request maximum on 10 minutes
})
app.use(limiter);

// creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello From Middleware');

    // setting up user variable globally
    req.requestMethod = req.url;
    next();
}
app.use(middleware);


// import all routes
const jobs = require('./routes/jobsRoutes')
const auth = require('./routes/auth')
const user = require('./routes/userRoutes')
const pegawai = require('./routes/pegawaiRoutes')
const kategori = require('./routes/kategoriRoutes')

app.use('/api/v1', jobs);
app.use('/api/v1', auth);
app.use('/api/v1', user);
// middleware to handle errors
// Handle unhandled routes

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});
// Middleware to handle errors
app.use(errorMiddleware);




const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server berjalan di port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
});


// handling unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to handled promise rejection')
    server.close( () => {
        process.exit(1);
    })
});


