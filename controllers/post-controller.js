const Post = require('../models/post');

exports.postsGET = (req, res) => {
  Post.find({ published: true }, (err, posts) => {
    if (err) {
      res.status(500).send('Error retrieving documents from database');
    }
    res.json(posts);
  });
};

exports.postGET = (req, res) => {
  Post.findById(req.params.postid, (err, post) => {
    if (err) {
      res.status(404).send(`Could not find post with id ${req.params.postid}`);
    }
    res.json(post);
  });
};

exports.postPOST = (req, res) => {
  const postDoc = new Post({ title: req.body.title, body: req.body.body });
  postDoc.save((err) => {
    if (err) {
      res.status(500).send('Error creating post');
    }
    res.send('Created post');
  });
};

exports.postPUT = (req, res) => {
  const post = new Post({
    _id: req.params.postid,
    title: req.body.title,
    body: req.body.body,
  });

  Post.findByIdAndUpdate(req.params.postid, post, (err) => {
    if (err) {
      res.status(404).send(`Could not find post with id ${req.params.postid}`);
    }
    res.send('Updated post');
  });
};

exports.postDELETE = (req, res) => {
  Post.findByIdAndDelete(req.params.postid, (err) => {
    if (err) {
      res.status(404).send(`Could not find post with id ${req.params.postid}`);
    }
    res.send('Deleted post');
  });
};
