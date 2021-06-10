const bcrypt = require('bcrypt');

class Helper {
    
    /**
    * @description this method is used to checkpassword
    * @param userPassword from body, encryptedPassword from Database
    * @return boolen value
    */
     checkPassword = (Userpassword, encryptedPass) => {
        return (Userpassword && encryptedPass) ? bcrypt.compareSync(Userpassword, encryptedPass) : false;
    }
}

module.exports = new Helper();