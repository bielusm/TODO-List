const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  User: { type: ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
