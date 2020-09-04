const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-div');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message');

const appendMessage = msg => {
    const messageElement = document.createElement('div');
    messageElement.innerText = msg;
    messageContainer.append(messageElement);
};

appendMessage('you joined');

socket.on('chat-message', msg => {
    appendMessage(msg);
});

messageForm.addEventListener('submit', event => {
    // prevert refreshing the page
    event.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    messageInput.value = '';
    
});

