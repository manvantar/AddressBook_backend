const mongoose = require('mongoose');

/*
 * function to connect mongoose database 
 * @returns connection
 */
function dbconnect(){

    mongoose.promise;
    mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    });

    return mongoose.connection
    .once('open', () => console.log('Mongo database Connected'))
    .on('error', (error)=> {
        console.log("Eroor found",error)
    });
}

module.exports=dbconnect;