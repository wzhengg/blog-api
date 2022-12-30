const async = require('async');
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');

const Comment = require('../models/comment');
const Post = require('../models/post');

exports.commentsGET = [
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

      // Construct array of functions to fetch each comment
      const tasks = [];
      for (const commentid of post.comments) {
        tasks.push(function (callback) {
          Comment.findById(commentid, callback);
        });
      }

      // Run all tasks to retrieve comemnts in parallel
      const comments = await async.parallel(tasks);
      return res.json(comments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.commentGET = [
  // Validate param fields
  param('postid').exists().isMongoId(),
  param('commentid').exists().isMongoId(),

  async (req, res) => {
    const { postid, commentid } = req.params;
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

      const comment = await Comment.findById(commentid);

      if (!comment || !post.comments.includes(comment._id)) {
        // Didn't find comment with given id, or post doesn't include comment
        return res.status(404).json({
          error: `Could not find comment with id ${commentid} in post with id ${postid}`,
        });
      }

      return res.json(comment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.commentPOST = [
  // Validate param field
  param('postid').exists().isMongoId(),

  // Validate and sanitize body field
  body('message', 'Message is required').trim().notEmpty().escape(),

  async (req, res) => {
    const { postid } = req.params;
    const { message } = req.body;

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

      // No validation errors and post exists, create and save comment
      const commentDoc = new Comment({ message });
      const comment = await commentDoc.save();

      // Add comment to post comments array
      post.comments.push(comment);
      await post.save();

      res.send('Created comment');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.commentPUT = [
  // Authenticate request
  passport.authenticate('jwt', { session: false }),

  // Validate param fields
  param('postid').exists().isMongoId(),
  param('commentid').exists().isMongoId(),

  // Validate and sanitize body field
  body('message', 'Message is required').trim().notEmpty().escape(),

  async (req, res) => {
    const { postid, commentid } = req.params;
    const { message } = req.body;

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

      const comment = await Comment.findById(commentid);

      if (!comment || !post.comments.includes(comment._id)) {
        // Didn't find comment with given id, or post doesn't include comment
        return res.status(404).json({
          error: `Could not find comment with id ${commentid} in post with id ${postid}`,
        });
      }

      // No validation errors and post and comment exist, update and save comment
      comment.message = message;
      await comment.save();

      return res.send('Updated comment');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.commentDELETE = [
  // Authenticate request
  passport.authenticate('jwt', { session: false }),

  // Validate param fields
  param('postid').exists().isMongoId(),
  param('commentid').exists().isMongoId(),

  async (req, res) => {
    const { postid, commentid } = req.params;
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

      const comment = await Comment.findById(commentid);

      if (!comment || !post.comments.includes(comment._id)) {
        // Didn't find comment with given id or post doesn't include comment
        return res.status(404).json({
          error: `Could not find comment with id ${commentid} in post with id ${postid}`,
        });
      }

      // Remove comment from post comments array
      await Post.findByIdAndUpdate(postid, {
        $pull: { comments: commentid },
      });

      // Delete comment
      await Comment.findByIdAndDelete(commentid);

      return res.send('Deleted comment');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];
