// 프로젝트 상태 변경
function updateTeamStatus(status) {
  const areYouSure = confirm(
    '한번 진행상태를 업데이트하면 이전 단계로는 돌아올 수 없습니다. \n\n정말 상태를 업데이트 하시겠습니까?'
  );
  if (!areYouSure) {
    return false;
  } else {
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
        if (data.message) {
          alert(data.message);
        } else {
          alert(data.updatedTeamStatus.message);
          nowStatus.classList.remove('now_team_status');
          nowStatus = document.querySelector(
            `.status-btn[data-num="${status}"]`
          );
          nowStatus.classList.add('now_team_status');
        }
      });
  }
}
