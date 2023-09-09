const expressAsyncHandler = require('express-async-handler');

const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'Name email')
      .populate('receiver')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'Name');
    message = await message.populate('chat');
    message = await message.populate('receiver');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'Name email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { allMessages, sendMessage };
