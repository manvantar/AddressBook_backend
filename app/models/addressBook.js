const mongoose = require("mongoose");
const logger = require("../../config/logger.js");

/**
 * @description Create Schema model of AddressBook Data with Schema level data valiadtion
 */
const AddressBookSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    lastName: { type: String, required: true, validate: /^[a-zA-Z ]{1,30}$/ },
    phoneNumber: {
      type: Number,
      integer: true,
      unique: true,
      required: true,
      validate: {
        validator: /^[0-9]{10}$/,
        message: "Mobile Number must be valid 10 digit number",
      },
    },
    city: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    state: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    pincode: { type: Number, required: true, validate: /^[0-9]{6}$/ },
    emailId: {
      type: String,
      required: true,
      validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z]+$/,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const AddressBook = mongoose.model("AddressBook", AddressBookSchema);

class AddressBookModel {
  /**
   * @description Create method is to save the new addressBook
   * @param newData is data sent from Services
   * @return callback is used to callback Services includes error message or data
   */
  create = (newData, callback) => {
    try {
      const addressBook = new AddressBook({
        firstName: newData.firstName,
        lastName: newData.lastName,
        phoneNumber: newData.phoneNumber,
        city: newData.city,
        state: newData.state,
        pincode: newData.pincode,
        emailId: newData.emailId,
      });
      addressBook.save({}, (error, data) => {
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err, null);
    }
  };

  /**
   * @description retrive all the AddressBooks from MongoDB
   * @param callback is receive data from Services
   * @return callback is used to callback Services with data or error message
   */
  findAllContacts = () => {
    try {
      return AddressBook.find().then((data) => {
        return data ? data: null;
      }).catch(error=>{
        return error;
      })
    } catch (err) {
      return err;
    }
  };

  /**
   * @description retrive all the Employee Data from MongoDB
   * @param objectId, callback is data sent from Services
   * @return callback is used to callback Services with data or error message
   */
  findDataId = (addressBookObjectId, callback) => {
    try {
      AddressBook.findById(addressBookObjectId, (error, data) => {
        return error ? callback(error, null) : callback(null, data);
      });
    } catch (err) {
      callback(err, null);
    }
  };

  /**
   * @description delete the AddressBook Data from MongoDB
   * @param objectId, callback is data sent from Services
   * @return callback is used to callback Services with or without error message
   */
  deleteDataUsingId = (addressBookObjectId, callback) => {
    try {
      AddressBook.findByIdAndDelete(addressBookObjectId, (error, data) => {
        if (!data && !error) {
          error = "no addressBook";
        }
        return error ? callback(error) : callback(null);
      });
    } catch (err) {
      callback(err, null);
    }
  };

  /**
   * @description Update the Registration_Data by Id
   * @param oldregistration_Id, New_UserData and callback
   * @return callback is used to callback Services with data or error message
   */
  updateById = (userId, newData, callback) => {
    try {
      AddressBook.findByIdAndUpdate(
        userId,
        {
          firstName: newData.firstName,
          lastName: newData.lastName,
          phoneNumber: newData.phoneNumber,
          city: newData.city,
          state: newData.state,
          pincode: newData.pincode,
          emailId: newData.emailId,
        },
        { new: true },
        (error, data) => {
          logger.info("model-> ", data);
          return error ? callback(error, null) : callback(null, data);
        }
      );
    } catch (err) {
      callback(err, null);
    }
  };
}
module.exports = new AddressBookModel();
