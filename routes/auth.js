const express = require('express');
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();

/* PUT /auth/signup */
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Por favor, entre com um email válido')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('O email já existe');
          }
        });
      }),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

/* POST /auth/login */
router.post(
  '/login',
  [
    body('email')
      .normalizeEmail(),
  ],
  authController.login);

module.exports = router;
