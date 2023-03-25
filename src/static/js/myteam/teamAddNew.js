// const url = window.location.pathname;

// 팀원 추가하기
function addNewMember() {
  const inputUserNickname = document.querySelector('#inputUserNickname');
  const nickname = inputUserNickname.value;
  const position = 1;
  inputUserNickname.value = '';

  const response = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname,
      position,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 201) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    });
  location.reload();
}
