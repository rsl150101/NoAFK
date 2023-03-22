const joinForm = document.getElementById('join-box');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');
const emailCheckBtn = document.getElementById('email-db-check');
const emailSendBtn = document.getElementById('send-email');
const emailAuthCheckBtn = document.getElementById('send-email-check');
var useEmail = false;
var passPassword = false;

function emailCheck() {
  // 이메일: aaa@aaa.aaa
  const emailCheck = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailCheck.test(emailInput.value)) {
    return (document.getElementById('emailMsg').style.display = 'block');
  }

  return (document.getElementById('emailMsg').style.display = 'none');
}

function passwordCheck() {
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

    passPassword = true;
    return (document.getElementById('passwordCheckMsg').style.display = 'none');
  });
}

function nicknameCheck() {
  // 닉네임:한글포함영어대소문자숫자
  const nicknameCheck = /^[A-za-z0-9가-힣]*.{1,20}$/;

  if (!nicknameCheck.test(nicknameInput.value)) {
    return (document.getElementById('nicknameMsg').style.display = 'block');
  }
  return (document.getElementById('nicknameMsg').style.display = 'none');
}

const sendEmailAuth = async () => {
  let email = emailInput.value;

  const response = await fetch('/api/auth/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (response.status === 500) {
    return alert('서버오류로 이메일 발송에 실패했습니다.');
  } else if (response.status === 200) {
    alert('이메일 발송 성공했습니다. 메일을 확인해주세요.');
  }
};

emailAuthCheckBtn.addEventListener('click', () => {
  const emailAuthCheck = document.getElementById('emailCheck').value;

  const authString = document.cookie.split('=')[1];

  if (authString !== emailAuthCheck) {
    return alert('인증번호가 틀렸습니다.');
  }

  useEmail = true;
  return alert('인증되었습니다.');
});

emailInput.addEventListener('change', emailCheck);

passwordInput.addEventListener('change', passwordCheck);

nicknameInput.addEventListener('change', nicknameCheck);

emailCheckBtn.addEventListener('click', async () => {
  let email = emailInput.value;

  const response = await fetch('/api/find-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (response.status === 409) {
    return alert('이미 가입한 이메일입니다.');
  } else if (response.status === 200) {
    document.getElementById('email-db-check').style.display = 'none';
    document.getElementById('send-email').style.display = 'block';
    return;
  }
});

if (emailSendBtn) {
  emailSendBtn.addEventListener('click', sendEmailAuth);
}

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  join();
});

const join = async () => {
  if (!useEmail) {
    return alert('이메일 인증을 완료해주세요!');
  }

  emailCheck();
  passwordCheck();
  nicknameCheck();

  if (!passPassword) {
    return alert('비밀번호를 다시 확인해주세요!');
  }

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const nickname = document.getElementById('nickname').value;

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

// 로그아웃
const logout = async () => {
  await fetch('/api/auth/logout');
};

window.onbeforeunload = function () {
  logout();
};
