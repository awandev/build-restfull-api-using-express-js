const express = require('express');
const app = express(); 

const dotenv = require('dotenv')

// setting up config.env file variables
dotenv.config({path: './config/config.env'})

// connect to database 


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

