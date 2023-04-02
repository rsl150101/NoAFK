function deleteTeam() {
  const areYouSure = confirm('정말 팀을 삭제하시겠습니까?');
  if (!areYouSure) {
    return false;
  } else {
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload();
      });
  }
}
