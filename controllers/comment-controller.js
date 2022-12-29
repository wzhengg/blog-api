const async = require('async');
const { isValidObjectId } = require('mongoose');

const Comment = require('../models/comment');
const Post = require('../models/post');

exports.commentsGET = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await Post.findById(postid);

    if (!post) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }

    const tasks = [];
    for (const commentid of post.comments) {
      tasks.push(function (callback) {
        Comment.findById(commentid, callback);
      });
    }

    const comments = await async.parallel(tasks);
    res.json(comments);
  } catch (err) {
    if (!isValidObjectId(postid)) {
      return res
        .status(404)
        .json({ error: `Could not find post with id ${postid}` });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.commentGET = async (req, res) => {
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

    return res.json({ comment });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

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
