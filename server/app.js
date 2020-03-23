const express = require('express')
const app = express();
const dotenv = require('dotenv')



const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors')

// setting up config.env file variables
dotenv.config({path: './config/config.env'})

// connecting to database
connectDatabase();
// setup body parser
app.use(express.json());



// creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello Middleware');
    next();
}

app.use(errorMiddleware);



// importing all routes
const jobs = require('./routes/jobs')
app.use('/api/v1', jobs);

// middleware to handle errors



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})