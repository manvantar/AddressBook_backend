const mongoose = require('mongoose');

/**
 * @description Create Schema model of Contact Data with Schema level data valiadtion
 */
const ContactSchema = mongoose.Schema({
    firstName: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    lastName: { type: String, required: true, validate: /^[a-zA-Z ]{1,30}$/ },
    phoneNumber: { type: Number, integer: true, required: true, unique: true, validate: {validator:/^[0-9]{10}$/, message:"Mobile Number must be valid 10 digit number"} },
    city: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    state: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    pincode: { type: Number, required: true, validate: /^[0-9]{6}$/ },
    emailId: { type: String, required: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z]+$/ },
}, {
    timestamps: false,
    versionKey: false
});

const Contact = mongoose.model('Contact', ContactSchema)

class ContactModel {

    /**
    * @description Create method is to save the new contact 
    * @param newData is data sent from Services
    * @return callback is used to callback Services includes error message or data
    */
    create = (newData, callback) => {
        const contact = new Contact({
            firstName: newData.firstName,
            lastName: newData.lastName,
            phoneNumber: newData.phoneNumber,
            city: newData.city,
            state: newData.state,
            pincode: newData.pincode,
            emailId: newData.emailId
        });
        contact.save({}, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        });
    }
}
module.exports = new ContactModel();