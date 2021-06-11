const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
chai.should();
chai.use(chaiHttp);
const fs = require('fs');
let rawdata = fs.readFileSync('test/addressBook.json');
let addressBookJSON = JSON.parse(rawdata);

describe("POST /add/user", () => {
    it("givenNewInputBody_WhenAdded_shouldReturnStatus=201,Success=true", (done) => {
        const inputBody = addressBookJSON.ValidUserData;
        chai.request(server)
            .post("/add/user")
            .send(inputBody)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("User Data Inserted successfully");
                done();
            });
    })

    it("givenDuplicateUser_WhenAdded_shouldReturnStatus=500,Success=false", (done) => {
        const inputBody2 = addressBookJSON.ValidUserData;
        chai.request(server)
            .post("/add/user")
            .send(inputBody2)
            .end((error, response) => {
                response.should.have.status(500);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })

    it("givenInvalidUserData_WhenAdded_shouldReturnStatus=400,Success=false", (done) => {
        const inputBody2 = addressBookJSON.inValidUserData;
        chai.request(server)
            .post("/add/user")
            .send(inputBody2)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })
})

describe("POST /login/user", () => {
    it("givenLoginCredentials_WhenLoggedIn_shouldReturnStatus=200,Success=true", (done) => {
        chai.request(server)
            .post("/login/user")
            .send(addressBookJSON.validLoginCredentials2)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("logged in successfully");
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=404,message=UserIdDoesn'tExist", (done) => {
        chai.request(server)
            .post("/login/user")
            .send(addressBookJSON.inValidLoginCredentials)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("UserId doesn't exist");
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=404,message=invalidCredentials", (done) => {
        chai.request(server)
            .post("/login/user")
            .send(addressBookJSON.inValidLoginCredentials2)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Credentials");
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=400,message=EmailIdMustBeAValidEmail ", (done) => {
        chai.request(server)
            .post("/login/user")
            .send(addressBookJSON.inValidLoginCredentials3)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq('"emailId" must be a valid email');
                done();
            });
    })
})

describe("GET /", () => {
    it("givenNewInputBody_whenLoggedIn_shouldReturnStatus200WithWelcomeMessage", (done) => {
        chai.request(server)
            .get("/")
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('message').eq("Welcome to AddressBook application Backend");
                done();
            });
    })
})

let jwToken = '';

beforeEach(done => {
    chai
        .request(server)
        .post("/login/user")
        .send(addressBookJSON.validLoginCredentials2)
        .end((err, res) => {
            jwToken = res.body.token;
            res.should.have.status(200);
            done();
        });
});

let invalidToken = jwToken.slice(12);
let empToken = '';

describe("POST /add/addressBook", () => {
    it("givenNewAddressBook_whenAdded_shouldReturnStatus=201Sucess=true", (done) => {

        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.ValidAddressBookData)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Contact Data Inserted successfully");
                done();
            });
    })

    it("givenDuplicateAddressBookAndEmptyToken_whenAdded_shouldReturnStatus=401Sucess=false", (done) => {

        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.ValidAddressBookData)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ");
                done();
            });
    })

    it("givenDuplicateAddressBookAndInvalidToken_whenAdded_shouldReturnStatus=400Sucess=false", (done) => {

        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.ValidAddressBookData)
            .set('Authorization', "Bearar " + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired");
                done();
            });
    })

    it("givenInValidAddressBookAndValidToken_whenAdded_shouldReturnStatus=400Sucess=false", (done) => {

        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.inValidAddressBookData)
            .set('Authorization', jwToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })
})

describe("GET /addressBooks", () => {
    it("givenToken_whenRetrieved_shouldReturnStatus=200Sucess=true", (done) => {

        chai.request(server)
            .get("/addressBooks")
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Retrived all the addressBook data successfully")
                done();
            });
    })

    it("givenInValidToken_whenRetrieved_shouldReturnStatus=400Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks")
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired");
                done();
            });
    })

    it("givenEmptyToken_whenRetrieved_shouldReturnStatus=401Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks")
            .set('Authorization', empToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ");
                done();
            });
    })
})

describe("GET /addressBooks/addressbookID", () => {
    it("givenAddressbookIdAndToken_whenRetrieved_shouldReturnStatus=200Sucess=true", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.validAddressBookId)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                done();
            });
    })

    it("givenAddressbookIdAndInvalidToken_whenRetrieved_shouldReturnStatus=400Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.validAddressBookId)
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired");
                done();
            });
    })

    it("givenAddressbookIdAndemptyToken_whenRetrieved_shouldReturnStatus=401Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.validAddressBookId)
            .set('Authorization', empToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ");
                done();
            });
    })

    it("givenInValidAddressbookIdAndToken_whenRetrieved_shouldReturnStatus=404Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.inValidAddressBookId)
            .set('Authorization', jwToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Contact not found with id 60c1f0dc31a6f437e485632");
                done();
            });
    })
})

describe("/Delele /Id", () => { 
    
    it("givenAddressBookIdValidToken_whenDeleted_shouldReturnStatus=200andsuccess=true", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/"+addressBookJSON.validAddressBookId2)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                done();
            });
    });

    it("givenInvalidAddressBookIdValidToken_whenDeleted_shouldReturnStatus=404andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/"+addressBookJSON.inValidAddressBookId)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                done();
            });
    });

    it("givenAddressBookIdInvalidToken_whenDeleted_shouldReturnStatus=400andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/"+addressBookJSON.validAddressBookId3)
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired")
                done();
            });
    });

    it("givenAddressBookIdEmptyToken_whenDeleted_shouldReturnstatus=401andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/"+addressBookJSON.validAddressBookId3)
            .set('Authorization', empToken)
            .end((err, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false)
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ")
                done();
            });
    });
    
});