const contactService = require('../services/addressBook.js');

class Controll {

    /**
     * @description Create and save the new Conmtact Data
     * @param req is request sent from http
     * @param res is used to send the Response
     */
    create = (req, res) => {
        let newContactData = req.body;
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