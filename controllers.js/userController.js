const express = require('express');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../Config/generateToken');

const loginController = expressAsyncHandler(async (req, res) => {
  const { Name, password } = req.body;

  const user = await User.findOne({ Name });
  console.log(await user.matchPassword(password));
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      Name: user.Name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid Name or password' });
  }
});

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
  if (user) {
    res.status(201).json({
      _id: user._id,
      Name: user.Name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(402).json({ message: 'Invalid user data' });
  }
});

module.exports = {
  loginController,
  registerController,
};
