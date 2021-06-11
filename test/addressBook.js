const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
chai.should();
chai.use(chaiHttp);
const fs = require('fs');
let rawdata = fs.readFileSync('test/addressBook.json');
let addressBookJSON = JSON.parse(rawdata);

describe("POST /add/user", () =>{
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

let jwToken='';
   
beforeEach(done => {
    chai
        .request(server)
        .post("/login/user")
        .send(addressBookJSON.validCredentials)
        .end((err, res) => {
            jwToken = res.body.token;
            res.should.have.status(200);
            done();
        });
});

let invalidToken=jwToken.slice(12);
let empToken='';

describe("POST /add/addressBook", () => {
    it("givenNewAddressBook_whenAdded_shouldReturnStatus=201Sucess=true", (done) => {
      
        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.ValidAddressBookData)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
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
                 done();
             });
     })

    it("givenDuplicateAddressBookAndInvalidToken_whenAdded_shouldReturnStatus=401Sucess=false", (done) => {
        
        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.ValidAddressBookData)
            .set('Authorization',invalidToken)
            .end((error, response) => {
                response.should.have.status(401);
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
                done();
            });
    })
})

describe("GET /addressBooks/addressbookID", () => {
    it("givenAddressbookIdAndToken_whenRetrieved_shouldReturnStatus=200Sucess=true", (done) => {
      
        chai.request(server)
            .get("/addressBooks/"+addressBookJSON.validAddressDataId)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('success').eq(true);
                done();
            });
    })

    it("givenAddressbookIdAndInvalidToken_whenRetrieved_shouldReturnStatus=400Sucess=false", (done) => {
      
        chai.request(server)
            .get("/addressBooks/"+addressBookJSON.validAddressDataId)
            .set('Authorization', 'Bearar ' + invalidToken)
            .end((error, response) => {
                response.should.have.status(400);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })

    it("givenAddressbookIdAndemptyToken_whenRetrieved_shouldReturnStatus=401Sucess=false", (done) => {
      
        chai.request(server)
            .get("/addressBooks/"+addressBookJSON.validAddressDataId)
            .set('Authorization',empToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })
})