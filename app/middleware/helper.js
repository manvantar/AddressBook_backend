const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

class Helper {

    /**
    * @description this method is used to checkpassword
    * @param userPassword from body, encryptedPassword from Database
    * @return boolen value
    */
    checkPassword = (Userpassword, encryptedPass) => {
        return (Userpassword && encryptedPass) ? bcrypt.compareSync(Userpassword, encryptedPass) : false;
    }

    /**
    * @description this method is used to generate JWT Token 
    * @param data->emailId, timelimit for the Token 
    * @return token
    */
    generateToken = (emailId, timeLimit) => {
        let token = sign({ email: emailId }, process.env.JWT_KEY, { expiresIn: timeLimit });
        return (!token) ? null : token;
    }

}

module.exports = new Helper();