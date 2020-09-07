const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-div');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const user_nickname = document.getElementById('nickname').value;

const appendMessage = msg => {
    const messageElement = document.createElement('div');
    messageElement.className = 'ui olive message'
    messageElement.innerText = msg;
    messageContainer.appendChild(messageElement);
};

(   () => {
        const msg = user_nickname + " is joined";
        socket.emit('user-join', msg);
        appendMessage("Hello " + user_nickname);
    }
)();


socket.on('chat-message', msg => {
    appendMessage(msg);
});

socket.on('notify-join', msg => {
    appendMessage(msg);
});

socket.on('notify-disconnect', msg => {
    appendMessage(msg);
});

// socket.on('disconnect', () => {
//     socket.emit('user-disconnect', user_nickname);
// });

messageForm.addEventListener('submit', event => {
    // prevert refreshing the page
    event.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', user_nickname +":  " + message);
    messageInput.value = '';
    
});

