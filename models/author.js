const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SALT_ROUNDS = 10;

const authorSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

authorSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hashedPassword;
  next();
});

authorSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Author', authorSchema);
