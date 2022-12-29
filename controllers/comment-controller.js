const async = require('async');
const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');

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

exports.commentPOST = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await Post.findById(req.params.postid);

    if (!post) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${req.params.postid}` });
    }

    const commentDoc = new Comment({ message: req.body.message });
    const comment = await commentDoc.save();

    post.comments.push(comment);
    await post.save();

    res.send('Created comment');
  } catch (err) {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${req.params.postid}` });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.commentPUT = async (req, res) => {
  const { postid, commentid } = req.params;
  try {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }

    if (!isValidObjectId(commentid)) {
      return res
        .status(404)
        .json({ error: `Could not find comment with id ${commentid}` });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }

    const comment = await Comment.findById(commentid);

    if (!comment || !post.comments.includes(comment._id)) {
      return res.status(404).json({
        error: `Could not find comment with id ${commentid} in post with id ${postid}`,
      });
    }

    comment.message = req.body.message;
    await comment.save();

    return res.send('Updated comment');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.commentDELETE = async (req, res) => {
  const { postid, commentid } = req.params;
  try {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }

    if (!isValidObjectId(commentid)) {
      return res
        .status(404)
        .json({ error: `Could not find comment with id ${commentid}` });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }

    const comment = await Comment.findById(commentid);

    if (!comment || !post.comments.includes(comment._id)) {
      return res.status(404).json({
        error: `Could not find comment with id ${commentid} in post with id ${postid}`,
      });
    }

    await Post.findByIdAndUpdate(postid, {
      $pull: { comments: commentid },
    });
    await Comment.findByIdAndDelete(commentid);

    return res.send('Deleted comment');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
