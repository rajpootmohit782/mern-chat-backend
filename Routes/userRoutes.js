const express = require('express');
const Router = express.Router();
const {
  loginController,
  registerController,
  fetchAllUsersController,
} = require('../controllers.js/userController.js');

Router.post('/login', loginController);
Router.post('/register', registerController);
Router.get('/chat', fetchAllUsersController);

module.exports = Router;
