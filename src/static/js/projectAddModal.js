const projectAddBtn = document.getElementById('projectAddBtn');
const projectAddModal = document.getElementById('projectAddModal');

const postModalData = async () => {
  if (projectAddModal.returnValue === 'register') {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const teamName = document.getElementById('teamName').value;
    const techStack = document.getElementById('techStack').value;
    const person = document.getElementById('person').value;
    const recruitDeadline = document.getElementById('recruitDeadline').value;
    const projectStart = document.getElementById('projectStart').value;
    const projectEnd = document.getElementById('projectEnd').value;

    const projectInfo = {
      title,
      content,
      teamName,
      techStack,
      person,
      recruitDeadline,
      projectStart,
      projectEnd,
      owner,
    };

    const response = await fetch('http://localhost:3000/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectInfo),
    });

    const { status } = response;

    if (status === 201) {
      alert('공고가 등록되었습니다!');
    } else {
      alert('공고 등록에 실패하였습니다!');
    }
  }
};

projectAddBtn.addEventListener('click', () => {
  projectAddModal.showModal();
});

projectAddModal.addEventListener('close', postModalData);
