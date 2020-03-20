const express = require('express')
const app = express();
const dotenv = require('dotenv')



// setting up config.env file variables
dotenv.config({path: './config/config.env'})
const connectDatabase = require('./config/database');
// connecting to database
connectDatabase();


// creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello Middleware');
    next();
}

app.use(middleware);



// importing all routes
const jobs = require('./routes/jobs')
app.use('/api/v1', jobs);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})