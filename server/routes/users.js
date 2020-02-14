const express = require('express');
router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
User = require('../models/User');

//@route POST api/users
//@desc Register user
//@access Public
router.post(
  '/',
  check('email').isEmail(),
  check('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      //Check if user exists
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: 'User already exists' });

      // Hash password
      const SALT_ROUNDS = 10;
      const hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);

      //Add User to Database
      const newUser = new User({
        email,
        password
      });
      newUser.save();

      //Construct JWT Token for ID
      payload = { id: newUser._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      //Send Token to user
      res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ error: 'Server Error' });
      console.error(error);
    }
  }
);

module.exports = router;
