const SocketIO = require('socket.io');

module.exports = (http, app) => {
  const io = SocketIO(http);
  app.set('io', io);
  const chat = io.of('/chat');
  const notice = io.of('/notice'); // 추후 전체 알림 기능 등 사용

  chat.on('connection', (socket) => {
    socket.emit('socketId', socket.id);

    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const path = referer.split('/chat/')[1].split('/');
    let { 0: chatId, 1: memberId } = path;
    req.nickname = '짱구'; // 임시구현

    if (memberId) {
      const whisperRoomId = [req.myId, memberId]
        .sort((a, b) => a - b)
        .join('&');
      chatId = whisperRoomId;
    }
    socket.join(chatId);

    socket.to(chatId).emit('join', {
      type: 'notice',
      params: { value: `${req.nickname}님이 입장하셨습니다.` },
    });

    socket.on('message', (msg) => {
      socket.emit('message', msg);
      socket.to(chatId).emit('message', msg);
    });

    socket.on('disconnect', () => {
      socket.to(chatId).emit('join', {
        type: 'notice',
        params: { value: `${req.nickname}님이 퇴장하셨습니다.` },
      });
      socket.leave(chatId);
    });
  });
};
