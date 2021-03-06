const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
chai.should();
chai.use(chaiHttp);
const fs = require('fs');
let rawdata = fs.readFileSync('test/addressBook.json');
let addressBookJSON = JSON.parse(rawdata);

describe("POST /registration", () => {
    it("givenNewInputBody_WhenAdded_shouldReturnStatus=201,Success=true", (done) => {
        const inputBody = addressBookJSON.ValidUserData;
        chai.request(server)
            .post("/registration")
            .send(inputBody)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("User Data Inserted successfully");
                if (error)
                    done(error);
                done();
            });
    })

    it("givenDuplicateUser_WhenAdded_shouldReturnStatus=500,Success=false", (done) => {
        const inputBody2 = addressBookJSON.ValidUserData;
        chai.request(server)
            .post("/registration")
            .send(inputBody2)
            .end((error, response) => {
                response.should.have.status(500);
                response.body.should.have.property('success').eq(false);
                if (error)
                    done(error);
                done();
            });
    })

    it("givenInvalidUserData_WhenAdded_shouldReturnStatus=400,Success=false", (done) => {
        const inputBody2 = addressBookJSON.inValidUserData;
        chai.request(server)
            .post("/registration")
            .send(inputBody2)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                if (error)
                    done(error);
                done();
            });
    })
})

describe("POST /login", () => {
    it("givenLoginCredentials_WhenLoggedIn_shouldReturnStatus=200,Success=true", (done) => {
        chai.request(server)
            .post("/login")
            .send(addressBookJSON.validLoginCredentials2)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("logged in successfully");
                if (error)
                    done(error);
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=404,message=UserIdDoesn'tExist", (done) => {
        chai.request(server)
            .post("/login")
            .send(addressBookJSON.inValidLoginCredentials)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("UserId doesn't exist");
                if (error)
                    done(error);
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=404,message=invalidCredentials", (done) => {
        chai.request(server)
            .post("/login")
            .send(addressBookJSON.inValidLoginCredentials2)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Credentials");
                if (error)
                    done(error);
                done();
            });
    })

    it("givenInValidLoginCredentials_WhenLoggedIn_shouldReturnStatus=400,message=EmailIdMustBeAValidEmail ", (done) => {
        chai.request(server)
            .post("/login")
            .send(addressBookJSON.inValidLoginCredentials3)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq('"emailId" must be a valid email');
                if (error)
                    done(error);
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
                if (error)
                    done(error);
                done();
            });
    })
})

let jwToken = '';

beforeEach(done => {
    chai
        .request(server)
        .post("/login")
        .send(addressBookJSON.validLoginCredentials2)
        .end((error, res) => {
            jwToken = res.body.token;
            res.should.have.status(200);
            if (error)
                done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
                done();
            });
    })
})

describe("GET /addressBooks/addressbookID", () => {
    it("givenAddressbookIdAndToken_whenRetrieved_shouldReturnStatus=200Sucess=true", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.validAddressBookId3)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                if (error)
                    done(error);
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
                if (error)
                    done(error);
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
                if (error)
                    done(error);
                done();
            });
    })

    it("givenInValidAddressbookIdAndToken_whenRetrieved_shouldReturnStatus=400Sucess=false", (done) => {

        chai.request(server)
            .get("/addressBooks/" + addressBookJSON.inValidAddressBookId)
            .set('Authorization', jwToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message')
                if (error)
                    done(error);
                done();
            });
    })
})

describe("/Delele /addressBook/Id", () => {

    it("givenAddressBookIdValidToken_whenDeleted_shouldReturnStatus=200andsuccess=true", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/" + addressBookJSON.validAddressBookId2)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                if (error)
                    done(error);
                done();
            });
    });

    it("givenInvalidAddressBookIdValidToken_whenDeleted_shouldReturnStatus=404andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/" + addressBookJSON.inValidAddressBookId)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                if (error)
                    done(error);
                done();
            });
    });

    it("givenAddressBookIdInvalidToken_whenDeleted_shouldReturnStatus=400andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/" + addressBookJSON.validAddressBookId3)
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired")
                if (error)
                    done(error);
                done();
            });
    });

    it("givenAddressBookIdEmptyToken_whenDeleted_shouldReturnstatus=401andSuccess=false", done => {
        chai
            .request(server)
            .delete("/delete/addressBook/" + addressBookJSON.validAddressBookId3)
            .set('Authorization', empToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false)
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ")
                if (error)
                    done(error);
                done();
            });
    });

});

describe("/PUT /update/addressBook/Id", () => {

    it("givenAddressBookDataToken_whenUpdated_shouldReturnStatus=200andSuccess=true", done => {
        chai
            .request(server)
            .put("/update/addressBook/" + addressBookJSON.validAddressBookId3)
            .send(addressBookJSON.ValidAddressBookData2)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true)
                response.body.should.have.property('message').eq("Contact Data updated successfully")
                if (error)
                    done(error);
                done();
            });
    });

    it("givenInvalidAddressBookDataToken_whenUpdated_shouldReturnStatus=404andSuccess=false", done => {
        chai
            .request(server)
            .put("/update/addressBook/" + addressBookJSON.validAddressBookId3)
            .send(addressBookJSON.invalidAddressBookData2)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                if (error)
                    done(error);
                done();
            });
    });

    it("given employeeData and invalid token When updated Should return status 400 and success=false", done => {
        chai
            .request(server)
            .put("/update/addressBook/" + addressBookJSON.validAddressBookId3)
            .send(addressBookJSON.invalidAddressBookData2)
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Invalid Token...or Expired")
                if (error)
                    done(error);
                done();
            });
    });

    it("given employeeData and empty token When updated Should return status 401 and success=false", done => {
        chai
            .request(server)
            .put("/update/addressBook/" + addressBookJSON.validAddressBookId3)
            .send(addressBookJSON.invalidAddressBookData2)
            .set('Authorization', empToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false)
                response.body.should.have.property('message').eq("Access Denied! Unauthorized User!! add Token and then Proceed ")
                if (error)
                    done(error);
                done();
            });
    });

});