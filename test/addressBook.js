const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
chai.should();
chai.use(chaiHttp);
const fs = require('fs');
let rawdata = fs.readFileSync('test/addressBook.json');
let addressBookJSON = JSON.parse(rawdata);

describe("POST /add/user", () =>{
    it("givenNewInputBody_WhenLoggedIn_shouldReturnStatus=200,Success=true", (done) => {
        const inputBody = addressBookJSON.loginData1;
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

    it("givenNewInputBody_WhenLoggedIn_shouldReturnStatus=500,Success=false", (done) => {
        const inputBody2 = addressBookJSON.loginData2;
        chai.request(server)
            .post("/add/user")
            .send(inputBody2)
            .end((error, response) => {
                response.should.have.status(500);
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
        .send(addressBookJSON.loginData3)
        .end((err, res) => {
            jwToken = res.body.token;
            res.should.have.status(200);
            done();
        });
});

let invalidToken=jwToken.slice(12);
let empToken='';

describe("POST /add/addressBook", () => {
    it("givenNewContactInBody_whenAdded_shouldReturnStatus=201Sucess=true", (done) => {
      
        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.contact1)
            .set('Authorization', 'Bearar ' + jwToken)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
                done();
            });
    })

    it("givenDuplicateContactAndEmptyToken_whenAdded_shouldReturnStatus=401Sucess=false", (done) => {
        
         chai.request(server)
             .post("/add/addressBook")
             .send(addressBookJSON.contact1)
             .end((error, response) => {
                 response.should.have.status(401);
                 response.body.should.have.property('success').eq(false);
                 done();
             });
     })

    it("givenDuplicateContactAndInvalidToken_whenAdded_shouldReturnStatus=400Sucess=false", (done) => {
        
        chai.request(server)
            .post("/add/addressBook")
            .send(addressBookJSON.contact1)
            .set('Authorization',invalidToken)
            .end((error, response) => {
                response.should.have.status(401);
                response.body.should.have.property('success').eq(false);
                done();
            });
    })
})
