const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  console.log(userId,chatId)
  const user2 = chatId;
  console.log('ans', userId);
  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: user2 } } },
    ],
  })

    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'Name email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [userId, user2],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  // Extract userId from the custom header 'X-User-ID'
  const userId = req.headers['x-user-id'];
  console.log(userId)

  try {
    Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'Name email',
        });
        res.status(200).send(results);
        console.log(results)
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


const fetchGroups = asyncHandler(async (req, res) => {
  // Your code for fetching groups goes here
  try {
    const allGroups = await Chat.find({ isGroupChat: true });
    res.status(200).send(allGroups);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  var users = JSON.parse(req.body.users);
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400).send(error);
  }
});

const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  //check is user is admin

  const removed = await Chat.findByIdAndUpdate(chatId, {
    $pull: { users: userId },
  })
    .populate('user', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    return res.status(404).send({ message: 'Chat not found' });
  } else {
    res.json(removed);
  }
});

const addSelfToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    return res.status(404).send({ message: 'Chat not found' });
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfToGroup,
};
