const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
