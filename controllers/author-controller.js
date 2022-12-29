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
