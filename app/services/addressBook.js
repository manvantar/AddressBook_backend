const logger = require("../../config/logger.js");
const contactModel = require("../models/addressBook.js");

class ContactService {
  /**
   * @description Create method of Model is called to save the new contact Data, Which also encrypts the password
   * @param newData is data sent from Controller
   * @return callback is used to callback Controller
   */
  create = (newData, callback) => {
    try {
      contactModel.create(newData, (error, data) => {
        if (error) {
          logger.error("addressBook Create service ->", error);
          return callback(error, null);
        }
        logger.info("addressBook Create service ->", data);
        return callback(null, data);
        // return (error) ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };

  /**
   * @description retrive all the Employee Data
   * @param callback is data sent from Controller
   * @return callback is used to callback Controller with data or error message
   */
  findAllContacts = (callback) => {
    try {
      contactModel.findAllContacts((error, data) => {
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };

  /**
   * @description retrive Employee Data
   * @param objectId and callback is data sent from Controller
   * @return callback is used to callback Controller with data or error message
   */
  findDataId = (contactObjectId, callback) => {
    try {
      contactModel.findDataId(contactObjectId, (error, data) => {
        logger.info("service->", data);
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };

  /**
   * @description delete Contact Data
   * @param ContactID and callback is data sent from Controller
   * @return callback is used to callback Controller with or  without error message
   */
  deleteDataUsingId = (contactObjectId, callback) => {
    try {
      contactModel.deleteDataUsingId(contactObjectId, (error) => {
        return error ? callback(error) : callback(null);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };

  /**
   * @description Create method of Model is called to save the new Contact Data  Which also encrypts the password
   * @param userdData is data sent from Controller
   * @return callback is used to callback Controller
   */
  updateByID = (userId, newUserData, callback) => {
    try {
      contactModel.updateById(userId, newUserData, (error, data) => {
        logger.info("services->", data);
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err || "Some error occurred!", null);
    }
  };
}
module.exports = new ContactService();
