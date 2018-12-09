// import chai, declare expect variable
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
//using these for controls
//destructuring modules
const { app, runServer, closeServer } = require("../server");
//this let's us make HTTP requests inour tests
chai.use(chaiHttp);

describe('CRUD blog posts', function(){
//only need these to SEED my database
    before(function(){
        //we need to start our server b4 we can run tests
        // return runServer();
    });
    after(function(){
        // return closeServer();
    });
//________________GET TEST_______________________
        it ('GET should grab blog posts on request', function() {
            return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                //because we create 2 posts upon load
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ["title", "content", "author", "publishDate"];
                res.body.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                  });
            })
        });
//__________POST TEST_______________
        it('POST should have a title, author, and content', function(){
            const normalBlogPost =
                {title: "Dogs are great", content:"Woof Woof", author: "Kitty"};

            return chai
            .request(app)
            .post("/blog-posts")
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
//_________PUT TEST_____________________        
    it ('PUT should update blog posts', function(){
        const updateBlog = {title: "huskies are an example of working dog breeds", content: "huskies were breed to run sleighs in cold temperatures. Pure bred huskies can survive in -20F!", author:"Kitty"};
        
        return (
            chai
                .request(app)
                //first we need to GET so we know what we need to update
                .get("/blog-posts")
                .then(function(res) {
                    updateBlog.id = res.body[0].id
                    //returns a promoise whose value will be the response object
                return chai
                    .request(app)
                    .put(`//${updateBlog.id}`)
                    .send(updateBlog);   
                })
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.deep.equals(updateBlog);
                })
        )
    });
//____________DELETE___________________________         
    it ("DELETE should remove blog post by ID", function() {
        return (
            chai
            .request(app)
            //first we have to make a GET request so we know what to delete
            .get("/blog-posts")
            .then(function(res){
                expect(res).to.have.status(204);
            })
        );
    });      
});