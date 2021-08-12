const addressBookService = require("../services/addressBook.js");
const validator = require("../middleware/validation.js");
const logger = require("../../config/logger.js");

class Controll {
  /**
   * @description Create and save the new Conmtact Data
   * @param req is request sent from http
   * @param res is used to send the Response
   */
  create = (req, res) => {
    try {
      let newContactData = req.body;
      var validationResult =
        validator.joiAddressBookValidator.validate(newContactData);
      if (validationResult.error) {
        return res.status(400).send({
          success: false,
          message: validationResult.error.details[0].message,
        });
      }

      addressBookService.create(newContactData, (error, resultdata) => {
        if (error) {
          return res.status(500).send({
            success: false,
            message: "Error occured while creating Contact",
            error: error.message,
          });
        }
        res.status(201).send({
          success: true,
          data: resultdata,
          message: "Contact Data Inserted successfully",
        });
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred!",
      });
    }
  };

  /**
   * @description find all the Contacts Data
   * @param req is request sent from http
   * @param res is used to send the Response
   */
  findAllContacts = (req, res) => {
    try {
      addressBookService
        .findAllContacts()
        .then((data) => {
          if (data === null) {
            res.send({
              success: true,
              message: "addressBook is empty",
            });
          }
          if (data) {
            res.send({
              success: true,
              message: "Retrived all the addressBook data successfully",
              Contacts: data,
            });
          } else {
            res.status(500).send({
              success: false,
              message: "Some error occurred!",
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            success: false,
            message: "Some error occurred!",
          });
        });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred!",
      });
    }
  };

  /**
   * @description find one the Contact Data
   * @param req is request sent from http
   * @param res is used to send the Response
   */
  findOneData = async (req, res) => {
    let addressBookObjectId = req.params.addressBookId;
    try {
      //logger.info(addressBookObjectId)
      let contact = await addressBookService.findDataId(addressBookObjectId);

      if (!contact) {
        return res.status(404).send({
          success: false,
          message: "Contact not found with id " + addressBookObjectId,
        });
      } else if (contact.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Contact not found with id " + addressBookObjectId,
        });
      } else if (data) {
        return res.send({
          success: true,
          foundData: contact,
        });
      } else {
        return res.status(500).send({
          success: false,
          message: error.message || "Some error occurred!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message || "Some error occurred!",
      });
    }
  };

  /**
   * @description find one the Contact Data and Delete
   * @param req is request sent from http
   * @param res is used to send the Response
   */
  delete = (req, res) => {
    try {
      let addressBookObjectId = req.params.addressBookId;
      addressBookService.deleteDataUsingId(addressBookObjectId, (error) => {
        logger.error(error);
        if (error) {
          if (error.kind === "ObjectId" || error == "no addressBook") {
            return res.status(404).send({
              success: false,
              message: "Contact not found with id " + addressBookObjectId,
            });
          }
          return res.status(500).send({
            success: false,
            message: "Error retrieving Contact with id " + addressBookObjectId,
          });
        }
        res.send({
          success: true,
          message: "Contact deleted successfully!",
        });
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred!",
      });
    }
  };

  /**
   * @description update addressBook Data by using Id after the data validation
   * @param req is request sent from http
   * @param res is used to send the Response
   */
  update = (req, res) => {
    try {
      var validationResult = validator.joiAddressBookValidator.validate(
        req.body
      );
      if (validationResult.error) {
        return res.status(400).send({
          success: false,
          message: validationResult.error.details[0].message,
        });
      }
      let addressBookData = req.body;
      let addressBookObjectId = req.params.addressBookId;
      addressBookService.updateByID(
        addressBookObjectId,
        addressBookData,
        (error, resultData) => {
          if (error) {
            if (error.kind === "ObjectId") {
              return res.status(404).send({
                success: false,
                message: "Contact not found with id " + addressBookObjectId,
              });
            }
            let str = error;
            if (
              error.message.includes(
                "E11000 duplicate key error collection: contact-book.addressbooks index: phoneNumber_1"
              )
            ) {
              return res.status(500).send({
                success: false,
                message:
                  "Connot updating addressBookID with duplicate Mobile Number",
              });
            }
            return res.status(500).send({
              success: false,
              message:
                "Error occured while updating addressBookID with " +
                addressBookObjectId,
            });
          }
          res.send({
            success: true,
            message: "Contact Data updated successfully",
            UpdatedData: resultData,
          });
        }
      );
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred!",
      });
    }
  };
}
module.exports = new Controll();
