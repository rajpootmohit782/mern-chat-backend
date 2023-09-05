const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
  chatName: { type: String },
  isGroupChat: { type: Boolean },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatModel);
module.exports = Chat;