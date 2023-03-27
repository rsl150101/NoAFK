function whispering(nickname) {
  const teamId = location.pathname.split('/')[2];
  const myNickname = document.querySelector('#userNickname').textContent;
  if (location.pathname.split('/')[1] === 'chat') {
    return (location.href = `/chat/${teamId}/${myNickname}/${nickname}`);
  }
  return open(
    `/chat/${teamId}/${myNickname}/${nickname}`,
    '_blank',
    'width=500, height=500, top=500px, left=1000px'
  );
}

function teamChatting() {
  const teamId = location.pathname.split('/')[2];
  const myNickname = document.querySelector('#userNickname').textContent;
  if (location.pathname.split('/')[1] === 'chat') {
    return (location.href = `/chat/${teamId}/${myNickname}`);
  }
  return open(
    `/chat/${teamId}/${myNickname}`,
    '_blank',
    'width=500, height=500, top=500px, left=1000px'
  );
}
