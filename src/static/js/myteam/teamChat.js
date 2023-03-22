function whispering(memberId) {
  const teamId = location.pathname.split('/')[2];
  location.pathname.split('/').length === 4;
  const memberIdWhisper = location.pathname.split('/')[3];
  if (location.pathname.split('/')[1] === 'chat') {
    return (location.href = `/chat/${teamId}/${memberId}`);
  }
  return open(
    `/chat/${teamId}/${memberId}`,
    '_blank',
    'width=500, height=500, top=500px, left=1000px'
  );
}

function teamChatting() {
  const teamId = location.pathname.split('/')[2];
  const memberIdWhisper = location.pathname.split('/')[3];
  if (location.pathname.split('/')[1] === 'chat') {
    return (location.href = `/chat/${teamId}`);
  }
  return open(
    `/chat/${teamId}`,
    '_blank',
    'width=500, height=500, top=500px, left=1000px'
  );
}
