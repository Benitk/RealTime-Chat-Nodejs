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


// create session and store in mongodb 

app.use(
  session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use(csrfProtection);

// set peer server on localhost:PORT/peerjs

app.use('/peerjs', peerServer);



// if user logged in share information between requests
// using session to identify user

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

app.use(appRoutes);


// make a connection to mongodb through moongose
// init our server to listen to given port or for defualt 3000
// using websockets (socket.io) to send realtime messages between clients

mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    server.listen(process.env.PORT || 3000);
    const io = require('./socket').init(server);
    io.on('connection', socket => {

      socket.on('user-join', (obj, roomID, peerID) => {
        socket.color = obj.color;
        socket.nickname = obj.msg.split(' ')[0];
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('notify-join', obj, peerID);

        socket.on('send-chat-message', obj => {
          io.to(roomID).emit('chat-message', obj);
        })

        socket.on('disconnect', () => {
          if (socket.nickname !== undefined) {
            const obj = {
              msg: socket.nickname + " is disconnected",
              color: socket.color
            };
            socket.to(roomID).broadcast.emit('notify-disconnect', obj, peerID);
          }
        });
      });
    });
  })
  .catch(err => {
    console.log(err);
  });
