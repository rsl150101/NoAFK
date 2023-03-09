// 팀원 방출
function emitMember(memberId) {
  fetch(url + `/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.deletedMember.message);
      location.reload();
    });
}