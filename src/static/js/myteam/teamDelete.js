function deleteTeam() {
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
