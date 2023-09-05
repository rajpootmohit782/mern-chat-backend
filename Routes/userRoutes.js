const express = require('express');
const Router = express.Router();
const {
  loginController,
  registerController,
} = require('../controllers.js/userController.js');

Router.post('/login', loginController);
Router.post('/register', registerController);

module.exports = Router;
