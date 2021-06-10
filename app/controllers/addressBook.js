const contactService = require('../services/addressBook.js');
const { joiValidator } = require('../middleware/validation.js');

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
}
module.exports=new Controll();