const contactController = require('../controllers/addressBook.js');

module.exports = (app) => {

    // Create a new contact
    app.post('/add', contactController.create);

    // Retrieve all contacts
    app.get('/contacts',  contactController.findAllContacts);

    // Retrieve a single contact with contactId
    app.get('/contacts/:contactId',  contactController.findOneData);

    /*// Delete a contact with contactId
    app.delete('/delete/:contactId',  contactController.delete);

    // Update a contact with contactId
    app.put('/update/:contactId',  contactController.update);*/
}