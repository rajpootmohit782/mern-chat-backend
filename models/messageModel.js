const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageModel);

module.exports = Message;
