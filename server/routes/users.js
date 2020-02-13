const express = require('express');
router = express.Router();
const { check, validationResult } = require('express-validator');

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

    res.send('Success');
  }
);

module.exports = router;
