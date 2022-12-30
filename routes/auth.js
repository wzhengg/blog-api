const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
  '/login',
  /**
   * NOTES ON authenticate()
   *
   * If authentication is successful, req.login is invoked
   * to set req.user to the authenticated user.
   *
   * If authentication fails, an HTTP 401 will be sent,
   * and the request-response cycle will end.
   */
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const { _id, username } = req.user;
    const body = { _id, username };
    const token = jwt.sign({ author: body }, process.env.TOKEN_SECRET);
    return res.json({ token });
  }
);

module.exports = router;
