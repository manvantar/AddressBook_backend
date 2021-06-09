const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
chai.should();
chai.use(chaiHttp);
const fs = require('fs');
let rawdata = fs.readFileSync('test/contactsData.json');
let contactJSON = JSON.parse(rawdata);

describe("GET /", () => {
    it("given new inputBody When loggedIn should return status 200 with welcome message", (done) => {
        chai.request(server)
            .get("/")
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('message').eq("Welcome to AddressBook application Backend");
                done();
            });
    })
})

describe("POST /add", () => {
    it("given new contact in body When added should return status=201 sucess=true", (done) => {
      
        chai.request(server)
            .post("/add")
            .send(contactJSON.contact1)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.have.property('success').eq(true);
                done();
            });
    })

    it("given contact with duplicate number in body When added should return status=500 sucess=false", (done) => {
       
         chai.request(server)
             .post("/add")
             .send(contactJSON.contact1)
             .end((error, response) => {
                 response.should.have.status(500);
                 response.body.should.have.property('success').eq(false);
                 done();
             });
     })
})
