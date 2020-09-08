const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-div');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const user_nickname = document.getElementById('nickname').value;
const user_color = document.getElementById('color').value;


// append message to container
const appendMessage = obj => {
    const messageElement = document.createElement('div');
    messageElement.className = `ui ${obj.color} message`;
    messageElement.innerText = obj.msg;
    messageContainer.appendChild(messageElement);
    window.scrollTo(0, messageContainer.scrollHeight);
};

(   () => {
        const obj = {
            msg: "Hello " + user_nickname,
            color: user_color
        };
        appendMessage(obj);
        obj.msg = user_nickname + " is joined";
        socket.emit('user-join', obj);
    }
)();

// on sending message
socket.on('chat-message', obj => {
    appendMessage(obj);
});

// on join to chat 
socket.on('notify-join', obj => {
    appendMessage(obj);
});

// on disconnect from chat 

socket.on('notify-disconnect', obj => {
    appendMessage(obj);
});

// listen when user send message using submit button
messageForm.addEventListener('submit', event => {
    // prevert refreshing the page
    event.preventDefault();
    const message = messageInput.value;
    const obj = {
        msg: user_nickname +":  " + message,
        color: user_color
    };
    socket.emit('send-chat-message', obj);
    messageInput.value = '';
    
});

