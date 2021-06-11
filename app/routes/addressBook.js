const addressBookController = require('../controllers/addressBook.js');
const userController = require('../controllers/user.js');
const helper= require('../middleware/helper.js')

module.exports = (app) => {

    // Create a new addressBook
    app.post('/add/addressBook', helper.validateToken, addressBookController.create);

    // Retrieve all addressBooks
    app.get('/addressBooks', helper.validateToken, addressBookController.findAllContacts);

    // Retrieve a single addressBook with addressBookId
    app.get('/addressBooks/:addressBookId', helper.validateToken, addressBookController.findOneData);

    // Delete a addressBook with addressBookId
    app.delete('/delete/addressBook/:addressBookId', helper.validateToken, addressBookController.delete);

    // Update a addressBook with addressBookId
    app.put('/update/addressBook/:addressBookId', helper.validateToken, addressBookController.update);

    // Create a new user
    app.post('/add/user', userController.create);

    // login a as user
    app.post('/login/user', userController.login);
    
}