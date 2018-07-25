const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
});

// @route   GET api/users/register
// @desc    Registers user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        size: "200",
        rating: "pg",
        default: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Return JWT (json web token)
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User does not exist" });
    }

    bcrypt.compare(password, user.password).then(match => {
      if (match) {
        res.json({ msg: "Succes" });
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

module.exports = router;
