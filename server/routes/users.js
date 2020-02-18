const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const config = require('config');

//@route POST api/users
//@desc Register user
//@access Public
router.post(
  '/',
  check('email').isEmail(),
  check('password').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      //Check if user exists
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });

      // Hash password
      const SALT_ROUNDS = 10;
      const hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);

      //Add User to Database
      const newUser = new User({
        email,
        hash
      });

      newUser.save();

      //Construct JWT Token for ID
      payload = { id: newUser._id };
      const token = jwt.sign(payload, config.JWT_SECRET);

      //Send Token to user
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

//@route POST api/users/login
//@desc Login user
//@access Public
router.post(
  '/login',
  check('email', 'Email is invalid').isEmail(),
  check('password', 'Password is required').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;

      //Get user if it exists
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'User does not exist' }] });

      const match = await bcrypt.compare(password, user.hash);
      if (!match)
        return res
          .status(401)
          .json({ errors: [{ msg: 'Username or password is incorrect' }] });

      //Construct JWT Token for ID
      payload = { id: user._id };
      const token = jwt.sign(payload, config.JWT_SECRET);

      //Send Token to user
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

//@route GET api/users/test
//@desc Test JWT authentication
//@access Private
router.get('/test', auth, async (req, res) => {
  try {
    console.log(req.id);
    const user = await User.findById(req.id, '-password');
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Server Error' });
  }
});

module.exports = router;
