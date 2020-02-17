const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  hash: { type: String, required: true },
  todos: [{ type: ObjectId, ref: 'Todo' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
