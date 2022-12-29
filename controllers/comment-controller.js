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

exports.commentGET = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
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
    post.save();

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

exports.commentPUT = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};

exports.commentDELETE = (req, res) => {
  res.send(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
};
