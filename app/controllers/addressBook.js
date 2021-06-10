const contactService = require('../services/addressBook.js');
const { joiValidator } = require('../middleware/validation.js');
const logger = require('../../config/logger.js');

class Controll {

    /**
     * @description Create and save the new Conmtact Data
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    create = (req, res) => {
        let newContactData = req.body;
        var validationResult = joiValidator.validate(newContactData);
        if (validationResult.error) {
            return res.status(400).send({
                success: false,
                message: validationResult.error.details[0].message
            });
        }

        contactService.create(newContactData, (error, resultdata) => {
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
        contactService.findAllContacts((error, Contacts) => {
            if (error) {
                return res.status(500).send({
                    success: false,
                    message: "Some error occured while fetching Data"
                });
            }
            res.send({
                success: true,
                message: "Retrived all the employee data successfully",
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
        let contactObjectId = req.params.contactId;
        contactService.findDataId(contactObjectId, (error, contactData) => {
            if (error) {
                logger.error("Contact not found with id " + contactObjectId);
                if (error.kind === 'ObjectId') {
                    return res.status(404).send({
                        success: false,
                        message: "Contact not found with id " + contactObjectId
                    });
                }
                return res.status(500).send({
                    success: false,
                    message: "Error retrieving Contact with id " + contactObjectId
                });
            }
            if (contactData)
                res.send({
                    success: true,
                    foundData: contactData
                });
            else {
                return res.status(404).send({
                    success: false,
                    message: "Contact not found with id " + req.params.ContactId
                });
            }
        })
    }

}
module.exports = new Controll();