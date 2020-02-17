const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  hash: { type: String, required: true },
  todos: [{ type: ObjectID, ref: 'Todo' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
