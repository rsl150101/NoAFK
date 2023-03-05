const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', () => {
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
    window.location.href = '/';
  }
};
