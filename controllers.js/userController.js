const express = require('express');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const loginController = () => {};

const registerController = expressAsyncHandler(async (req, res) => {
  const { Name, email, password } = req.body;

  //checking all the fields
  if (!Name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  //preExisting user
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  //name preExisting
  const userNameExists = await User.findOne({ Name });
  if (userNameExists) {
    return res.status(400).json({ message: 'Name already exists' });
  }

  //create entry as new user in db
  const user = await User.create({ Name, email, password });
});

module.exports = {
  loginController,
  registerController,
};
