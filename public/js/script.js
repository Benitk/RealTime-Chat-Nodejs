const socket = io('/');

const videoGrid = document.getElementById('video-grid')
const messageWindow = document.getElementsByClassName('main__chat_window');
const messageContainer = document.getElementById('message-div');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const user_nickname = document.getElementById('nickname').value;
const user_color = document.getElementById('color').value;
const roomID = document.getElementById('roomID').value;


// create new webRTC object using peerjs
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: 3000
})

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// get micropone and camera hardware
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  // answer webRTC call 
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  // on join to chat 
  socket.on('notify-join', (obj, peerID) => {
    appendMessage(obj);
    connectToNewUser(peerID, stream)
  })
  
  // on reciving message 
  socket.on('chat-message', obj => {
    appendMessage(obj);
  });

  // listen when user send message using submit button
  messageForm.addEventListener('submit', event => {
    // prevert refreshing the page
    event.preventDefault();
    const message = messageInput.value;
    const obj = {
      msg: user_nickname + ":  " + message,
      color: user_color
    };
    socket.emit('send-chat-message', obj);
    messageInput.value = '';

  });

})

// call new user with webRTC communication (peerjs)
const connectToNewUser = (peerID, stream) => {
  const call = myPeer.call(peerID, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  peers[peerID] = call
}


// append video to video grid on given video element and stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


// append message to container
const appendMessage = obj => {
  const messageElement = document.createElement('div');
  messageElement.className = `ui ${obj.color} message`;
  messageElement.innerText = obj.msg;
  messageContainer.appendChild(messageElement);

  scrollToBottom()
};

// on new message scroll automaticly botton
const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


(() => {
  const obj = {
    msg: "Hello " + user_nickname,
    color: user_color
  };
  appendMessage(obj);
  obj.msg = user_nickname + " is joined";
  myPeer.on('open', id => {
    socket.emit('user-join', obj, roomID, id)
  })
}
)();



socket.on('notify-disconnect', (obj, peerID) => {
  appendMessage(obj);
  if (peers[peerID]) peers[peerID].close();
});


