const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const userRouter = require('./Routes/userRoutes');
const chatRouter = require('./Routes/chatRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});
const port = process.env.PORT || 3000;

app.use('/user', userRouter);
app.use('/chat', chatRouter);

const connectDb = () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URI);
    console.log('DB is connected successfully');
  } catch (e) {
    console.log(e);
  }
};

connectDb();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
