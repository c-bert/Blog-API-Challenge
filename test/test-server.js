// import chai, declare expect variable
const expect = require("chai").expect;
const chaiHttp = require("chai-http");
//using these for controls
//destructuring modules
const { app, runServer, closeServer } = require("../server");
//this let's us make HTTP requests inour tests
chai.use(chaiHttp);

describe('CRUD blog posts', function(){

    before(function(){
        //we need to start our server b4 we can run tests
        return runServer();
    });
    after(function(){
        return closeServer();
    });



        it('POST should have a title, author, and content', function(){
            const normalBlogPost =
                {title: "Dogs are great", content:"Woof Woof", author: "Kitty"};

            return chai
            .request(app)
            .post("/")
            .send(normalBlogPost)
            //then is our Promise
            //send our normal blog post to our test
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
                expect(res.body.id).to.not.equal(null);
                //deep equal takes "a deeper look" at the response properties
                expect(res.body).to.deep.equal(Object.assign(normalBlogPost, {id: res.body.id})
                );
            });
        });
});