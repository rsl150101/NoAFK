// const url = window.location.pathname;

// 팀원 추가하기
function addNewMember() {
  const inputUserNickname = document.querySelector('#inputUserNickname');
  const nickname = inputUserNickname.value;
  inputUserNickname.value = '';
  const position = 1;

  fetch(url, {
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
      alert(data.newMember.message);
      location.reload();
    });
}
