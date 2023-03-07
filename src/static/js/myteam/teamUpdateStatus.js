// 프로젝트 상태 변경
function updateTeamStatus(status) {
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.updatedTeamStatus.message);
      nowStatus.classList.remove('now_team_status');
      nowStatus = document.querySelector(`.status-btn[data-num="${status}"]`);
      nowStatus.classList.add('now_team_status');
    });
}
