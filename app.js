const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const { ExpressPeerServer } = require('peer');
require('dotenv').config();

const path = require('path');

const appRoutes = require('./routes/route');
const User = require('./models/User');

const app = express();
const server = require('http').Server(app);

const peerServer = ExpressPeerServer(server, {
  debug: true
});

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/peerjs', peerServer);
app.use(
  session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// signup, login chat routes
app.use(appRoutes);



mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
      server.listen(3000);
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
