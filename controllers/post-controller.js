const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const Post = require('../models/post');

exports.postsGET = async (req, res) => {
  try {
    const posts = await Post.find({ published: true });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.postGET = [
  // Validate param field
  param('postid').exists().isMongoId(),

  async (req, res) => {
    const { postid } = req.params;
    try {
      // Find validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are validation errors
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(postid);

      if (!post) {
        // Didn't find post with given id
        return res
          .status(404)
          .json({ error: `Could not find post with id ${postid}` });
      }

      // No validation errors and post exists, send response
      return res.json(post);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.postPOST = [
  // Validate and sanitize body fields
  body('title', 'Title is required').trim().notEmpty().escape(),
  body('body', 'Body is required').trim().notEmpty().escape(),

  async (req, res) => {
    const { title, body } = req.body;
    try {
      // Find validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are validation errors
        return res.status(400).json({ errors: errors.array() });
      }

      // No validation errors, create and save post
      const postDoc = new Post({ title, body });
      await postDoc.save();

      return res.send('Created post');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.postPUT = async (req, res) => {
  const { postid } = req.params;
  const { title, body } = req.body;
  try {
    const post = await Post.findById(postid);

    if (!post) {
      return res
        .status(404)
        .send({ error: `Could not find post with id ${postid}` });
    }

    post.title = title;
    post.body = body;
    await post.save();

    res.send('Updated post');
  } catch (err) {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .send({ error: `Could not find post with id ${postid}` });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.postDELETE = async (req, res) => {
  const { postid } = req.params;
  try {
    await Post.findByIdAndDelete(postid);
    res.send('Deleted post');
  } catch (err) {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .send({ error: `Could not find post with id ${postid}` });
    }
    return res.status(500).json({ error: err.message });
  }
};
