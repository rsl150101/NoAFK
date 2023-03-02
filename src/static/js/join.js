const joinBtn = document.getElementById('join-btn');

joinBtn.addEventListener('click', () => {
  join();
});

const join = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordTwice = document.getElementById('passwordCheck').value;
  const nickname = document.getElementById('nickname').value;

  // 이메일: aaa@aaa.aaa
  const emailCheck = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // 비밀번호: 영어대소문자숫자
  const passwordCheck = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;
  // 닉네임:한글포함영어대소문자숫자
  const nicknameCheck = /^[A-za-z0-9가-힣]*.{1,20}$/;

  if (
    !emailCheck.test(email) ||
    !passwordCheck.test(password) ||
    !nicknameCheck.test(nickname)
  ) {
    return alert('형식이 틀렸습니다. 다시 확인해주세요.');
  }

  if (password !== passwordTwice) {
    return alert('비밀번호를 다시 확인해주세요.');
  }

  const userInfo = { email, password, nickname };

  const response = await fetch('/api/auth/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  console.log(response);
  if (response.status === 200) {
    window.location.href = '/login';
  }
};
