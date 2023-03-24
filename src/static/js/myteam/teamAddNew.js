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
  });
  const { status } = response;
  if (status !== 201) {
    alert('닉네임을 찾을 수 없거나 이미 팀에 등록된 닉네임입니다.');
    location.reload();
  }
}
