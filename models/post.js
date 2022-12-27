const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  published: { type: Boolean, default: true },
});

module.exports = mongoose.model('Post', postSchema);
