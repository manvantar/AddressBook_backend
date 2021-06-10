const userModel = require('../models/user.js');
const { genSaltSync, hashSync } = require("bcrypt");

class UserService {

    /**
    * @description Create method of Model is called to save the new user Data, Which also encrypts the password
    * @param newData is data sent from Controller
    * @return callback is used to callback Controller
    */
    create = (userData, callback) => {
        const salt = genSaltSync(5);
        userData.password = hashSync(userData.password, salt);
        userModel.create(userData, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        })
    }
}
module.exports = new UserService();