const contactModel = require('../models/addressBook.js');

class ContactService {

    /**
    * @description Create method of Model is called to save the new contact Data, Which also encrypts the password
    * @param newData is data sent from Controller
    * @return callback is used to callback Controller
    */
    create = (newData, callback) => {
        contactModel.create(userData, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        })
    }
}

module.exports=new ContactService();