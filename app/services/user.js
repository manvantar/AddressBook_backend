const userModel = require('../models/user.js');
const { genSaltSync, hashSync } = require("bcrypt");
const bcrypt = require('bcrypt');

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

    /**
     * @description checkLogindetails used to validate the username and password
     * @param loginData having emailId and password
     * @return callback is used to callback controller with JsonWebToken or error message
     */
    checkLoginDetails = (credentials, callback) => {
        userModel.checkLoginDetails(credentials, (error, data) => {
            if (error) {
                return callback(error, null);
            }
            return (!bcrypt.compareSync(credentials.password, data.password)) ? callback("Invalid Credentials", null) : callback(null, "successful Login");
        });
    }

}
module.exports = new UserService();