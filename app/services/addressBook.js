const logger = require('../../config/logger.js');
const contactModel = require('../models/addressBook.js');

class ContactService {

    /**
    * @description Create method of Model is called to save the new contact Data, Which also encrypts the password
    * @param newData is data sent from Controller
    * @return callback is used to callback Controller
    */
    create = (newData, callback) => {
        contactModel.create(newData, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        })
    }

    /**
    * @description retrive all the Employee Data
    * @param callback is data sent from Controller
    * @return callback is used to callback Controller with data or error message
    */
    findAllContacts = (callback) => {
        contactModel.findAllContacts((error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        });
    }

    /**
    * @description retrive Employee Data
    * @param objectId and callback is data sent from Controller
    * @return callback is used to callback Controller with data or error message
    */
    findDataId = (contactObjectId, callback) => {
        contactModel.findDataId(contactObjectId, (error, data) => {
            logger.info("service->", data);
            return (error) ? callback(error, null) : callback(null, data);
        });
    }

    /**
    * @description delete Contact Data
    * @param ContactID and callback is data sent from Controller
    * @return callback is used to callback Controller with or  without error message
    */
    deleteDataUsingId = (contactObjectId, callback) => {
        contactModel.deleteDataUsingId(contactObjectId, error => {
            return (error) ? callback(error) : callback(null);
        });
    }

    /**
    * @description Create method of Model is called to save the new Contact Data  Which also encrypts the password
    * @param userdData is data sent from Controller
    * @return callback is used to callback Controller
    */
    updateByID = (userId, newUserData, callback) => {
        contactModel.updateById(userId, newUserData, (error, data) => {
            logger.info("services->", data)
            return (error) ? callback(error, null) : callback(null, data);
        })
    }

}
module.exports = new ContactService();