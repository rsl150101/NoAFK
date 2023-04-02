// 팀원 방출
function emitMember(memberId) {
  const areYouSure = confirm('정말 방출하시겠습니까?');
  if (!areYouSure) {
    return false;
  } else {
    fetch(url + `/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.deletedMember.message);
        location.reload();
      });
  }
}
