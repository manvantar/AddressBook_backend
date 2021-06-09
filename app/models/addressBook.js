const mongoose = require('mongoose');

/**
 * @description Create Schema model of Contact Data with Schema level data valiadtion
 */
const ContactSchema = mongoose.Schema({
    firstName: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    lastName: { type: String, required: true, validate: /^[a-zA-Z ]{1,30}$/ },
    phoneNumber: { type: integer, required: true, createindex:true, valiadate: /@"^\d{10}$/ },
    city: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    state: { type: String, required: true, validate: /^[a-zA-Z ]{3,30}$/ },
    pincode: { type: integer, required: true, validate: /@"^\d{6}$/ },
    emailId: { type: String, required: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z]+$/ },
}, {
    timestamps: false,
    versionKey: false
});

const Contact = mongoose.model('Contact', ContactSchema)