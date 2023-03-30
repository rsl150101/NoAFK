const loginForm = document.getElementById('login-box');
const resetPwBtn = document.getElementById('reset-pw-btn');
const sendEmailModal = document.getElementById('send-email-modal');

const sendEmailModalData = async () => {
  if (sendEmailModal.returnValue === 'send') {
    const email = document.getElementById('send-email-input').value;

    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 201) {
      alert('비밀번호가 재발급되었습니다. 메일을 확인해주세요!');
    }
    if (response.status === 429) {
      return alert('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    }
    if (response.status === 500) {
      return alert('이메일이 잘못되었습니다.');
    }
  }
};

if (resetPwBtn) {
  resetPwBtn.addEventListener('click', () => {
    sendEmailModal.showModal();
  });
}

if (sendEmailModal) {
  sendEmailModal.addEventListener('close', sendEmailModalData);
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

const login = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userInfo = { email, password };

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  if (response.status === 200) {
    return (window.location.href = '/');
  }
  if (response.status === 403) {
    return alert('차단된 유저입니다.');
  }
  if (response.status === 401) {
    return alert('존재하지 않는 유저입니다.');
  }
  if (response.status === 400) {
    return alert('로그인 실패!');
  }
  if (response.status === 429) {
    return alert(
      '너무 많은 요청으로 5분 동안 차단되었습니다. 5분 뒤 다시 시도해주세요.'
    );
  }
};
