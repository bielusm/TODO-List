const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: Date,
  User: { type: ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
