const SocketIO = require('socket.io');

module.exports = (http, app) => {
  const io = SocketIO(http);
  app.set('io', io);
  const chat = io.of('/chat');
  const notice = io.of('/notice'); // 추후 전체 알림 기능 등 사용

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속.');

    console.log(`socket.id: ${socket.id} 클라이언트와 연결되었습니다.`);
    socket.emit('socketId', socket.id);

    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    console.log(referer);
    let chatId = referer.split('/chat/')[1].split('/')[0];
    const memberId = referer.split('/chat/')[1].split('/')[1];
    console.log(chatId, memberId);
    req.myId = '21';
    req.nickname = '닉네임자리';

    if (memberId) {
      const memberIds = [req.myId, memberId];
      memberIds.sort((a, b) => a - b);
      console.log(memberIds);
      const whisperRoomId = memberIds.join('&');
      chatId = whisperRoomId;
    }
    socket.join(chatId);
    console.log(`현재 접속 룸: ${chatId}`);

    socket.to(chatId).emit('join', {
      type: 'notice',
      params: { value: `${req.nickname}님이 입장하셨습니다.` },
    });

    socket.emit('usercount', {
      type: 'notice',
      params: { value: `현재 접속자 수: ${socket.adapter.rooms[chatId]}` },
    });

    socket.on('message', (msg) => {
      console.log('Message received: ' + msg);

      socket.emit('message', msg);
      socket.to(chatId).emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.to(chatId).emit('join', {
        type: 'notice',
        params: { value: `${req.nickname}님이 퇴장하셨습니다.` },
      });
      socket.leave(chatId);
    });
  });
};
