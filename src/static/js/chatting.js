const path = location.pathname.split('/');
console.log(path);
const teamId = path[2];
const memberId = path[3];

const socket = io.connect(`http://localhost:3000/chat`);
socket.memberId = memberId;
console.log(socket.id, socket.memberId, socket.nickname);

socket.on('join', (message) => {
  const incomingNotice = message;
  showNotice(incomingNotice);
});

socket.on('usercount', (message) => {
  const incomingNotice = message;
  showNotice(incomingNotice);
});

// 폼에 있는 메세지 보내기
document.forms.publish.onsubmit = function () {
  let outgoingMessage = this.message.value;
  this.message.value = '';
  const obj = { type: 'message', params: { value: outgoingMessage } };
  const userId = 13;
  socket.emit('message', JSON.stringify(obj));

  fetch(`/chat/${teamId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      message: outgoingMessage,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    });

  return false;
};

socket.on('message', (message) => {
  let incomingMessage = message;
  console.log(incomingMessage);
  showMessage(incomingMessage);
});

function showMessage(message) {
  let messageElem = document.createElement('div');
  const obj = JSON.parse(message);
  console.log(obj.params.value);
  messageElem.textContent = obj.params.value;
  document.getElementById('messages').append(messageElem);
}

function showNotice(message) {
  let messageElem = document.createElement('div');
  const obj = message;
  console.log(obj.params.value);
  messageElem.textContent = obj.params.value;
  document.getElementById('messages').append(messageElem);
}
