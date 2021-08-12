const userModel = require("../models/user.js");
const { genSaltSync, hashSync } = require("bcrypt");
const helper = require("../middleware/helper.js");

class UserService {
  /**
   * @description Create method of Model is called to save the new user Data, Which also encrypts the password
   * @param newData is data sent from Controller
   * @return callback is used to callback Controller
   */
  create = (userData, callback) => {
    try {
      const salt = genSaltSync(5);
      userData.password = hashSync(userData.password, salt);
      userModel.create(userData, (error, data) => {
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };

  /**
   * @description checkLogindetails used to validate the username and password
   * @param loginData having emailId and password
   * @return callback is used to callback controller with JsonWebToken or error message
   */
  checkLoginDetails = (credentials, callback) => {
    try {
      userModel.checkLoginDetails(credentials, (error, data) => {
        if (error) {
          return callback(error, null);
        }
        if (helper.checkPassword(credentials.password, data.password)) {
          let token = helper.generateToken(data.emailId, process.env.JWT_TIMER);
          return !token
            ? callback("Something went wrong while generating JWT", null)
            : callback(null, token);
        }
        return callback("Invalid Credentials", null);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };
}
module.exports = new UserService();
