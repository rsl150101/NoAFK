const path = location.pathname.split('/');
const { 2: teamId, 4: memberNickname } = path;
const nickname = document.querySelector('#userNickname').textContent;

const socket = io.connect(`/chat`);

const chatSpace = document.querySelector('#messages');
chatSpace.scrollTop = document.querySelector('#messages').scrollHeight;

socket.on('join', (message) => {
  const incomingNotice = message;
  showNotice(incomingNotice);
});

// 폼에 있는 메세지 보내기
document.forms.publish.onsubmit = function () {
  let outgoingMessage = document.getElementById('messages-input').value;
  document.getElementById('messages-input').value = '';
  const obj = { type: 'message', params: { nickname, value: outgoingMessage } };
  socket.emit('message', JSON.stringify(obj));
  showMyMessage(obj);

  let submitPath = teamId;
  if (memberNickname) {
    submitPath = [teamId, nickname, memberNickname].join('/');
  }

  fetch(`/chat/${submitPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: outgoingMessage,
    }),
  });

  return false;
};

socket.on('message', (message) => {
  let incomingMessage = message;
  showOthersMessage(incomingMessage);
});

function showMyMessage(obj) {
  let messageElem = document.createElement('div');
  messageElem.classList.add('my-chat');
  messageElem.insertAdjacentHTML(
    'beforeend',
    `<span class='my-chat__nickname'>👈${obj.params.nickname}</span><span>${obj.params.value}</span>`
  );
  document.getElementById('messages').append(messageElem);

  scrollDownToBottom();
}

function showOthersMessage(message) {
  let obj = message;
  if (typeof message === 'string') {
    obj = JSON.parse(message);
  }
  let messageElem = document.createElement('div');
  messageElem.classList.add('others-chat');
  messageElem.insertAdjacentHTML(
    'beforeend',
    `<span class='others-chat__nickname'>${obj.params.nickname}👉</span><span>${obj.params.value}</span>`
  );
  document.getElementById('messages').append(messageElem);

  scrollDownToBottom();
}

function showNotice(message) {
  let messageElem = document.createElement('div');
  messageElem.classList.add('notice');
  let obj = message;

  messageElem.textContent = obj.params.value;
  document.getElementById('messages').append(messageElem);

  scrollDownToBottom();
}

function scrollDownToBottom() {
  const chatSpace = document.querySelector('#messages');
  chatSpace.scrollTop = document.querySelector('#messages').scrollHeight;
}
