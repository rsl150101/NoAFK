// const url = window.location.pathname;

// 팀원 추가하기
function addNewMember() {
  const inputUserNickname = document.querySelector('#inputUserNickname');
  const nickname = inputUserNickname.value;
  inputUserNickname.value = '';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
  location.reload();
}

function agree(memberId) {
  fetch(url + `/${memberId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      position: 1,
      task: '담당업무를 정해주세요',
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('초대를 수락하여 팀에 합류합니다.');
      location.reload();
    });
}

function refuse(memberId) {
  fetch(url + `/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert('초대를 거절하였습니다.');
      location.href = `/teams/me`;
    });
}
