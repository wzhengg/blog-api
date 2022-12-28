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
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};

exports.postPOST = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};

exports.postPUT = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};

exports.postDELETE = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};
