require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const addressesRouter = require('./routes/addresses');
const filesRouter = require('./routes/files');
const authRouter = require('./routes/auth');
const mailManagerRouter = require('./routes/mailManager');

const app = express();
console.log('process.env.MONGO_URI', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/addresses', addressesRouter);
app.use('/files', filesRouter);
app.use('/auth', authRouter);
app.use('/mailmanager', mailManagerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
