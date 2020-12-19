# RealTime-Chat-Nodejs

## video streaming and messaging between peers as the server acts also as a connection broker.

## This project includes:
* socket.io for real-time, bidirectional and event-based communication between the browser and the server
* peer.js for creating a P2P data and media stream connection
* Parsing Requests & Sending Responses using Express.js
* Registration, Login management with user authentication and authorization
* Validating User Input with express-validator
* Integration with mongodb by using moongose
* Rendering HTML Dynamically (on the Server) using ejs
* Using the Model-View-Controller (MVC) Pattern
* Sessions & Cookies

## Installation:
clone this repo into local folder.

**With Docker**
* create .env file and write ``` MONGODB_CONTAINER_URI=mongodb://mongo:27017/chat-users ```
* open terminal in repo folder and write ``` docker-compose build ```  ``` docker-compose up ```

**With 3rd party mongodb service**
* create .env file and write ``` MONGODB_URI=YourAPIKey ```
* open terminal in repo folder and write ``` npm install ```  ``` npm start ```

now open your browser at localhost:3000 

## Website Flow
After login into the website you will enter your lobby room, each user genereate unique room.

you can see it on the url after **video&chat/yourRoomID**, check the example pic below.

send the roomID to your other peer and have fun.

**note that the video turned off in the picture**
![](https://github.com/Benitk/RealTime-Chat-Nodejs/blob/master/public/img/videochat.png)

![](https://github.com/Benitk/RealTime-Chat-Nodejs/blob/master/public/img/login.png)

![](https://github.com/Benitk/RealTime-Chat-Nodejs/blob/master/public/img/signup.png)




