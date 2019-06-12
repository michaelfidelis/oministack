const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(require('./routes'));

app.use((request, response, next) => {
  request.io = io;
  next();
});

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploaded', 'resized')))
// mongodb+srv://semana:semana@cluster0-onrzf.mongodb.net/test?retryWrites=true&w=majority;

mongoose
  .connect('mongodb://localhost:27017/oministack', {
    useNewUrlParser: true, });

server.listen(3333); 