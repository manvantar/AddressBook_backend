const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const jwt = require("jsonwebtoken");

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

    /**
    * @description CheckToken method is used to validate the Token before the execution of next
    * @param req from the user, res to server , next method 
    */
    validateToken = (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            if(token.includes("Bearar "))
                token = token.slice(7);
            jwt.verify(token, process.env.JWT_KEY, err => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: "Invalid Token...or Expired"
                    });
                } 
                else {
                    next();
                }
            });
        }
        else {
            return res.status(401).send({
                success: false,
                message: "Access Denied! Unauthorized User!! add Token and then Proceed "
            });
        }
    }

}

module.exports = new Helper();