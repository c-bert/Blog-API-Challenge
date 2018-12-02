const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
    // title, content, author, publishDate
    'Working Class Dog Breeds', 'There are several working dog breeds. Working dogs need lots of exercise. They are highly intelligent and love to please. Make sure you are prepared to give your working breed plenty of daily attention so they are the ideal companion.', 'Miss Molly', Date.now()
);
BlogPosts.create(
    // title, content, author, publishDate
    'Hypoallergenic Dog Breeds', 'There are several Hypoallergenic Dog Breeds. Hypoallergenic dog breeds can be a wonderful alternative for dog-loving families with allergies. The ever popular poodle, yorkshire terrier, and shih tzu are just a few examples.', 'Miss Molly', Date.now()
);

// send back JSON representation of all BlogPosts
// on GET requests to root
router.get('/', (req, res) => {
  console.log("working GET");
    res.json(BlogPosts.get());
    // res.json("working GET");
  });

  // when new blog post is added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
    // ensure `title` is in request body
    const requiredFields = ['title'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const item = BlogPosts.create(req.body.title, req.body.ingredients);
    res.status(201).json(item);
  });
  
  // Delete BlogPosts (by id)!
  router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post item \`${req.params.ID}\``);
    res.status(204).end();
  });
  
  // when PUT request comes in with updated recipe, ensure has
  // required fields. also ensure that recipe id in url path, and
  // recipe id in updated item object match. if problems with any
  // of that, log error and send back status code 400. otherwise
  // call `BlogPosts.updateItem` with updated recipe.
  router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content
    });
    res.status(204).end();
  })
  
  module.exports = router;