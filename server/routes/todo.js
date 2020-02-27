const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const Moment = require('moment');
const errorFormater = require('./errorFormater');

//@route POST api/todo
//@desc Create todo
//@access Private
router.post('/', [auth, check('name').notEmpty()], async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(errorFormater);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });

    const { name, description } = req.body;

    //Get user by ID
    const user = await User.findById(req.id, '-password');
    if (!user)
      return res.status(400).json({ errors: [{ msg: 'Invalid JWT Token' }] });

    const date = Moment.now();

    const todo = new Todo({
      name,
      description,
      date,
      User: user._id
    });
    todo.save();

    user.todos = [...user.todos, todo._id];
    user.save();

    return res.status(200).send('Todo added');
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//@route GET api/todo
//@desc Get all todos for logged in user
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(errorFormater);
    //Get users todos by id
    const user = await User.findById(req.id, 'todos').populate('todos');
    if (!user)
      return res.status(400).json({ errors: [{ msg: 'Invalid JWT Token' }] });

    return res.status(200).json(user.todos);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
  }
});

module.exports = router;
