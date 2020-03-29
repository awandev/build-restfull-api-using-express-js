const express = require('express');
const app = express(); 

const dotenv = require('dotenv')

// connect to database 
const connectDatabase = require('./config/database')

// setting up config.env file variables
dotenv.config({path: './config/config.env'})

// connecting to database
connectDatabase();

// setup bodyparser
app.use(express.json());


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
const pegawai = require('./routes/pegawaiRoutes')
const kategori = require('./routes/kategoriRoutes')

app.use('/api/v1', 
    jobs,
    pegawai,
    kategori);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
});

