const { isValidObjectId } = require('mongoose');
const Author = require('../models/author');

exports.authorGET = async (req, res) => {
  const { authorid } = req.params;
  try {
    const author = await Author.findById(authorid);

    if (!author) {
      return res
        .status(404)
        .json({ error: `Could not find author with id ${authorid}` });
    }

    res.json(author);
  } catch (err) {
    if (!isValidObjectId(authorid)) {
      return res
        .status(404)
        .json({ error: `Could not find author with id ${authorid}` });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.authorPOST = async (req, res) => {
  const { username, password } = req.body;
  try {
    const authorCount = await Author.countDocuments({});

    if (authorCount > 0) {
      return res.status(403).json({ error: `An author already exists` });
    }

    const author = new Author({ username, password });
    await author.save();

    return res.send('Created author');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
