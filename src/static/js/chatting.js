const path = location.pathname.split('/');
const { 2: teamId, 3: memberId } = path;
const nickname = document.querySelector('#userNickname').textContent;
console.log(nickname);

const socket = io.connect(`http://localhost:3000/chat`);

socket.on('join', (message) => {
  const incomingNotice = message;
  showMessage(incomingNotice);
});

// 폼에 있는 메세지 보내기
document.forms.publish.onsubmit = function () {
  let outgoingMessage = this.message.value;
  this.message.value = '';
  const obj = { type: 'message', params: { value: outgoingMessage } };
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
  });

  return false;
};

socket.on('message', (message) => {
  let incomingMessage = message;
  showMessage(incomingMessage);
});

function showMessage(message) {
  let messageElem = document.createElement('div');
  let obj = message;

  if (typeof message === 'string') {
    obj = JSON.parse(message);
  }

  messageElem.textContent = obj.params.value;
  document.getElementById('messages').append(messageElem);
}
