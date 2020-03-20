const mongoose = require('mongoose')
const connectDatabase = () => { mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB Database connected with host: ${con.connection.host}`);
    });
};

// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = connectDatabase;