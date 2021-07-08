const mongoose = require('mongoose');

/**
 * @description Create Schema model of User Data with Schema level data valiadtion
 */
const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    lastName: { type: String, required: true, validate: /^[a-zA-Z ]{1,30}$/ },
    emailId: { type: String, required: true, unique: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z]+$/ },
    password: { type: String, required: true }
}, {
    timestamps: false,
    versionKey: false
});

const User = mongoose.model('User', UserSchema)

class UserModel {

    /**
    * @description Create method is to save the new User Data
    * @param userdData is data sent from Services
    * @return callback is used to callback Services includes error message or data
    */
    create = (userdata, callback) => {
        const user = new User({
            firstName: userdata.firstName,
            lastName: userdata.lastName,
            emailId: userdata.emailId,
            password: userdata.password
        });
        user.save({}, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        });
    }

    /**
    * @description Get the data by emailID
    * @param loginData having emailId and password
    * @return callback is used to callback Services with data or error message
    */
    checkLoginDetails = (credentials, callback) => {
        User.findOne({ "emailId": credentials.emailId }, (error, data) => {
            if (error) {
                return callback(error, null)
            }
            return (!data) ? callback("UserId doesn't exist", null) : callback(null, data);
        })
    }
}

module.exports = new UserModel();