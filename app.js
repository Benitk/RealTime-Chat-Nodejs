const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const path = require('path');

const router = require('./routes/route');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// signup, login routes
app.use(router);


mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    const server = app.listen(3000);
    const io = require('./socket').init(server);
    io.on('connection', socket =>{
        socket.on('send-chat-message', obj => {
            io.emit('chat-message', obj);
        });
        socket.on('user-join', obj => {
            socket.color = obj.color;
            socket.nickname = obj.msg.split(' ')[0];
            socket.broadcast.emit('notify-join', obj);
        });
        socket.on('disconnect', () => {
          if(socket.nickname !== undefined){
            const obj = {
              msg: socket.nickname + " is disconnected",
              color: socket.color
          };
            socket.broadcast.emit('notify-disconnect', obj);
          }
        });
    });
  })
  .catch(err => {
    console.log(err);
  });
