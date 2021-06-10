const addressBookController = require('../controllers/addressBook.js');
const userController = require('../controllers/user.js');
const helper= require('../middleware/helper.js')

module.exports = (app) => {

    // Create a new addressBook
    app.post('/add/addressBook', addressBookController.create);

    // Retrieve all addressBooks
    app.get('/addressBooks', helper.checkToken, addressBookController.findAllContacts);

    // Retrieve a single addressBook with addressBookId
    app.get('/addressBooks/:addressBookId',  addressBookController.findOneData);

    // Delete a addressBook with addressBookId
    app.delete('/delete/addressBook/:addressBookId',  addressBookController.delete);

    // Update a addressBook with addressBookId
    app.put('/update/addressBook/:addressBookId',  addressBookController.update);

    // Create a new user
    app.post('/add/user', userController.create);

    // login a as user
    app.post('/user/login', userController.login);
    
}