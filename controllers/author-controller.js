const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const Author = require('../models/author');

exports.authorGET = [
  // Validate params field
  param('authorid').exists().isMongoId(),

  async (req, res) => {
    const { authorid } = req.params;
    try {
      // Find validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are validation errors
        return res.status(400).json({ errors: errors.array() });
      }

      const author = await Author.findById(authorid);

      if (!author) {
        // Didn't find author with given id
        return res
          .status(404)
          .json({ error: `Could not find author with id ${authorid}` });
      }

      // No validation errors and author exists, send response
      res.json(author);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.authorPOST = [
  // Validate and sanitize body fields
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .escape(),
  body('password', 'Password must be at least 8 characters long')
    .trim()
    .isLength({ min: 8 })
    .escape(),

  async (req, res) => {
    const { username, password } = req.body;
    try {
      // Only one author can exist in the database
      const authorCount = await Author.countDocuments({});
      if (authorCount > 0) {
        return res.status(403).json({ error: `An author already exists` });
      }

      // Find validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are validation errors
        return res.status(400).json({ errors: errors.array() });
      }

      // No validation errors, create and save author
      const author = new Author({ username, password });
      await author.save();

      return res.send('Created author');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.authorPUT = [
  // Validate params field
  param('authorid').exists().isMongoId(),

  // Validate and sanitize body fields
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .escape(),
  body('password', 'Password must be at least 8 characters long')
    .trim()
    .isLength({ min: 8 })
    .escape(),

  async (req, res) => {
    const { authorid } = req.params;
    const { username, password } = req.body;

    try {
      // Find validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are validation errors
        return res.status(400).json({ errors: errors.array() });
      }

      const author = await Author.findById(authorid);

      if (!author) {
        // Didn't find author with given id
        return res
          .status(404)
          .json({ error: `Could not find author with id ${authorid}` });
      }

      // No validation errors and author exists, update and save author
      author.username = username;
      author.password = password;
      await author.save();

      return res.send('Updated author');
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
];

exports.authorDELETE = async (req, res) => {
  const { authorid } = req.params;
  try {
    await Author.findByIdAndDelete(authorid);
    return res.send('Deleted author');
  } catch (err) {
    if (!isValidObjectId(authorid)) {
      return res
        .status(404)
        .json({ error: `Could not find author with id ${authorid}` });
    }
    return res.status(500).json({ error: err.message });
  }
};
