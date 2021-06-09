const mongoose = require('mongoose');

/*
 * function to connect mongoose database 
 * @returns connection
 */
function dbconnect(){

    mongoose.promise;
    mongoose.connect("mongodb://localhost:27017/address-book", {
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