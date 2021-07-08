const addressBookService = require('../services/addressBook.js');
const validator = require('../middleware/validation.js');
const logger = require('../../config/logger.js');

class Controll {

    /**
     * @description Create and save the new Conmtact Data
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    create = (req, res) => {
        let newContactData = req.body;
        var validationResult = validator.joiAddressBookValidator.validate(newContactData);
        if (validationResult.error) {
            return res.status(400).send({
                success: false,
                message: validationResult.error.details[0].message
            });
        }

        addressBookService.create(newContactData, (error, resultdata) => {
            if (error) {
                return res.status(500).send({
                    success: false,
                    message: "Error occured while creating Contact",
                    error: error.message
                });
            }
            res.status(201).send({
                success: true,
                data: resultdata,
                message: "Contact Data Inserted successfully"
            })
        })
    }


    /**
     * @description find all the Contacts Data
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    findAllContacts = (req, res) => {
        addressBookService.findAllContacts((error, Contacts) => {
            if (error) {
                return res.status(500).send({
                    success: false,
                    message: "Some error occured while fetching Data"
                });
            }
            res.send({
                success: true,
                message: "Retrived all the addressBook data successfully",
                Contacts: Contacts
            })
        })
    }


    /**
     * @description find one the Contact Data
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    findOneData = (req, res) => {
        let addressBookObjectId = req.params.addressBookId;
        //logger.info(addressBookObjectId)
        addressBookService.findDataId(addressBookObjectId, (error, addressBookData) => {
            if (error) {
                //logger.error("Contact not found with id " + addressBookObjectId);
                if (error.kind === 'ObjectId') {
                    return res.status(404).send({
                        success: false,
                        message: "Contact not found with id " + addressBookObjectId
                    });
                }
                return res.status(500).send({
                    success: false,
                    message: "Error retrieving Contact with id " + addressBookObjectId
                });
            }
            if (addressBookData)
                res.send({
                    success: true,
                    foundData: addressBookData
                });
            else {
                return res.status(404).send({
                    success: false,
                    message: "Contact not found with id " + addressBookObjectId
                });
            }
        })
    }

    /**
     * @description find one the Contact Data and Delete
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    delete = (req, res) => {
        let addressBookObjectId = req.params.addressBookId;
        addressBookService.deleteDataUsingId(addressBookObjectId, error => {
            logger.error(error)
            if (error) {
                if (error.kind === 'ObjectId' || error == "no addressBook") {
                    return res.status(404).send({
                        success: false,
                        message: "Contact not found with id " + addressBookObjectId
                    });
                }
                return res.status(500).send({
                    success: false,
                    message: "Error retrieving Contact with id " + addressBookObjectId
                });
            }
            res.send({
                success: true,
                message: "Contact deleted successfully!"
            });
        })
    };

    /**
     * @description update addressBook Data by using Id after the data validation
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    update = (req, res) => {
        var validationResult = validator.joiAddressBookValidator.validate(req.body);
        if (validationResult.error) {
            return res.status(400).send({
                success: false,
                message: validationResult.error.details[0].message
            });
        }
        let addressBookData = req.body;
        let addressBookObjectId = req.params.addressBookId;
        addressBookService.updateByID(addressBookObjectId, addressBookData, (error, resultData) => {
            if (error) {
                if (error.kind === 'ObjectId') {
                    return res.status(404).send({
                        success: false,
                        message: "Contact not found with id " + addressBookObjectId
                    });
                }
                let str = error;
                if (error.message.includes("E11000 duplicate key error collection: contact-book.addressbooks index: phoneNumber_1")) {
                    return res.status(500).send({
                        success: false,
                        message: "Connot updating addressBookID with duplicate Mobile Number"
                    });
                }
                return res.status(500).send({
                    success: false,
                    message: "Error occured while updating addressBookID with " + addressBookObjectId
                });
            }
            res.send({
                success: true,
                message: "Contact Data updated successfully",
                UpdatedData: resultData
            })
        })
    };

}
module.exports = new Controll();