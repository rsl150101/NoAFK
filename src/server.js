const http = require('./app');
const PORT = 3000;
require('./socket'); // 이렇게 불러오기만 해도 소켓에 연결이 됩니다.

http.listen(PORT, () => {
  console.log(PORT, '번 포트로 서버가 요청을 받을 준비가 됐어요');
});
