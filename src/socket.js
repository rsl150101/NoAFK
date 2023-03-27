const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server);
  app.set('io', io);
  const chat = io.of('/chat');
  const notice = io.of('/notice'); // 추후 전체 알림 기능 등 사용
  chat.on('connection', async (socket) => {
    const req = socket.request;
    const {
      headers: { referer },
    } = req;

    const path = referer.split('/chat/')[1].split('/');
    let { 0: teamId, 1: myNickname, 2: memberNickname } = path;

    let chatId = teamId;
    if (memberNickname) {
      chatId = [teamId, myNickname, memberNickname].sort().join('&');
    }

    socket.join(chatId);

    socket.to(chatId).emit('join', {
      type: 'notice',
      params: {
        value: `${decodeURIComponent(myNickname)}님이 입장하셨습니다.`,
      },
    });

    socket.on('message', (message) => {
      socket.to(chatId).emit('message', message);
    });

    socket.on('disconnect', () => {
      socket.to(chatId).emit('join', {
        type: 'notice',
        params: {
          value: `${decodeURIComponent(myNickname)}님이 퇴장하셨습니다.`,
        },
      });
      socket.leave(chatId);
    });
  });
};
