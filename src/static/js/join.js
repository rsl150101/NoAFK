const joinForm = document.getElementById('join-box');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');

emailInput.addEventListener('change', () => {
  // 이메일: aaa@aaa.aaa
  const emailCheck = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailCheck.test(emailInput.value)) {
    return (document.getElementById('emailMsg').style.display = 'block');
  }
  return (document.getElementById('emailMsg').style.display = 'none');
});

passwordInput.addEventListener('change', () => {
  // 비밀번호: 영어대소문자숫자
  const passwordCheck = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;

  if (!passwordCheck.test(passwordInput.value)) {
    return (document.getElementById('passwordMsg').style.display = 'block');
  }

  document.getElementById('passwordMsg').style.display = 'none';

  const passwordTwice = document.getElementById('passwordCheck');

  passwordTwice.addEventListener('change', () => {
    if (passwordInput.value !== passwordTwice.value) {
      return (document.getElementById('passwordCheckMsg').style.display =
        'block');
    }

    return (document.getElementById('passwordCheckMsg').style.display = 'none');
  });
});

nicknameInput.addEventListener('change', () => {
  // 닉네임:한글포함영어대소문자숫자
  const nicknameCheck = /^[A-za-z0-9가-힣]*.{1,20}$/;

  if (!nicknameCheck.test(nicknameInput.value)) {
    return (document.getElementById('nicknameMsg').style.display = 'block');
  }
  return (document.getElementById('nicknameMsg').style.display = 'none');
});

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
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

  if (response.status === 200) {
    window.location.href = '/login';
  }
};
