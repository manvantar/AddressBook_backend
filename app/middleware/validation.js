const joi = require("@hapi/joi");

class Validation{

  //validates AddressBook
   joiAddressBookValidator= joi.object({
    firstName: joi.string().alphanum().min(3).max(30),
    lastName: joi.string().alphanum().min(2).max(30),
    city: joi.string().alphanum().min(2).max(30),
    state: joi.string().alphanum().min(2).max(30),
    phoneNumber:joi.number().min(1000000000).max(9999999999),
    pincode:joi.number().min(100000).max(999999),
    emailId: joi.string().email().required(),       
  });

  //valiadtes newUserdata
  joiUserValidator= joi.object({
    firstName: joi.string().alphanum().min(3).max(30),
    lastName: joi.string().alphanum().min(2).max(30),
    emailId: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required()
  });

  //validates Credentials
  joiCredentialsValidator= joi.object({
    emailId: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required()
  });

}

module.exports = new Validation();