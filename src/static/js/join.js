const joinForm = document.getElementById('join-box');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');
const passwordTwice = document.getElementById('passwordCheck');
const emailCheckBtn = document.getElementById('email-db-check');
const nicknameCheckBtn = document.getElementById('nickname-db-check');
const emailSendBtn = document.getElementById('send-email');
const emailAuthCheckBtn = document.getElementById('send-email-check');
const emailAuthInput = document.getElementById('emailCheck');

let useEmail = false;
let passEmail = false;
let passPassword = false;
let useNickname = false;
let passNickname = false;
let authString;

function emailCheck() {
  passEmail = false;
  // 이메일: aaa@aaa.aaa
  const emailCheck = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailCheck.test(emailInput.value)) {
    return (document.getElementById('emailMsg').style.display = 'block');
  }

  passEmail = true;
  document.getElementById('emailMsg').style.display = 'none';
}

function emailRecheck() {
  emailAuthRecheck();
  document.getElementById('emailOKMsg').style.display = 'none';
  document.getElementById('email-db-check').style.display = 'block';
  document.getElementById('send-email').style.display = 'none';
  emailCheck();
}

function passwordCheck() {
  // 비밀번호: 영어대소문자숫자
  const passwordCheck = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;

  if (!passwordCheck.test(passwordInput.value)) {
    return (document.getElementById('passwordMsg').style.display = 'block');
  }

  document.getElementById('passwordMsg').style.display = 'none';
  passwordTwiceCheck();

  passwordTwice.addEventListener('change', passwordTwiceCheck);
}

function passwordTwiceCheck() {
  passPassword = false;
  if (passwordInput.value !== passwordTwice.value) {
    return (document.getElementById('passwordCheckMsg').style.display =
      'block');
  }

  passPassword = true;
  return (document.getElementById('passwordCheckMsg').style.display = 'none');
}

function nicknameCheck() {
  passNickname = false;

  // 닉네임:한글포함영어대소문자숫자
  const nicknameCheck = /^[가-힣a-zA-Z0-9].{1,20}$/;

  if (!nicknameCheck.test(nicknameInput.value)) {
    return (document.getElementById('nicknameMsg').style.display = 'block');
  }

  passNickname = true;
  return (document.getElementById('nicknameMsg').style.display = 'none');
}

function nicknameRecheck() {
  useNickname = false;
  document.getElementById('nicknameOKMsg').style.display = 'none';
  document.getElementById('nickname-db-check').style.display = 'block';
  nicknameCheck();
}

const sendEmailAuth = async () => {
  emailCheck();

  if (!passEmail) {
    return alert('이메일이 형식에 맞지않아 메일을 보낼 수 없습니다.');
  }

  let email = emailInput.value;

  fetch('/api/auth/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        authString = data.authString;
        return alert('이메일 발송 성공했습니다. 메일을 확인해주세요.');
      }
      if (data.status === 500) {
        return alert('이메일 발송에 실패했습니다.');
      }
      if (data.status === 429) {
        return alert(data.message);
      }
    });
};

function emailAuthCheck() {
  useEmail = false;

  const emailAuthCheck = document.getElementById('emailCheck').value;

  if (authString !== emailAuthCheck) {
    return alert('인증번호가 틀렸습니다.');
  }

  useEmail = true;
  emailAuthCheckBtn.style.display = 'none';
  document.getElementById('send-email').style.display = 'none';

  return alert('인증되었습니다.');
}

function emailAuthRecheck() {
  useEmail = false;
  emailAuthCheckBtn.style.display = 'block';
  emailAuthCheckBtn.addEventListener('click', emailAuthCheck);
}

emailAuthCheckBtn.addEventListener('click', emailAuthCheck);

emailInput.addEventListener('change', emailRecheck);

passwordInput.addEventListener('change', passwordCheck);

nicknameInput.addEventListener('change', nicknameRecheck);

emailAuthInput.addEventListener('change', emailAuthRecheck);

emailCheckBtn.addEventListener('click', async () => {
  emailCheck();

  if (!passEmail) {
    return;
  }

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
  }
  if (response.status === 200) {
    document.getElementById('email-db-check').style.display = 'none';
    document.getElementById('send-email').style.display = 'block';
    document.getElementById('emailOKMsg').style.display = 'block';
    return;
  }
  if (response.status === 429) {
    return alert('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  }
});

nicknameCheckBtn.addEventListener('click', async () => {
  nicknameCheck();

  if (!passNickname) {
    return;
  }

  let nickname = nicknameInput.value;

  const response = await fetch('/api/find-nickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });

  if (response.status === 409) {
    return alert('이미 가입한 닉네임입니다.');
  }
  if (response.status === 200) {
    document.getElementById('nickname-db-check').style.display = 'none';
    document.getElementById('nicknameOKMsg').style.display = 'block';
    useNickname = true;
    return;
  }
  if (response.status === 500) {
    return alert('사용할 수 없는 닉네임이거나 서버오류입니다.');
  }
  if (response.status === 429) {
    return alert('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
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
  if (!useNickname) {
    return alert('닉네임 증복체크를 완료해주세요!');
  }

  emailCheck();
  passwordCheck();
  nicknameCheck();

  if (!passEmail || !passPassword || !passNickname) {
    return;
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
    alert('회원가입 성공!');
    window.location.href = '/login';
  }
  if (response.status === 429) {
    return alert('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  }
};
