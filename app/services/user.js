const userModel = require('../models/user.js');

class UserService {

    /**
    * @description Create method of Model is called to save the new user Data, Which also encrypts the password
    * @param newData is data sent from Controller
    * @return callback is used to callback Controller
    */
    create = (newData, callback) => {
        userModel.create(newData, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        })
    }
}
module.exports = new UserService();