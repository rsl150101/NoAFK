const editBoardBtn = document.getElementById('edit-board-btn');
const projectEditModal = document.getElementById('projectEditModal');

const editModalData = async () => {
  if (projectEditModal.returnValue === 'register') {
    const title = document.getElementById('edit-title').value;
    const teamName = document.getElementById('teamName').value;
    const techStack = document.getElementById('edit-techStack').value;
    const person = document.getElementById('edit-person').value;
    const recruitDeadline = document.getElementById(
      'edit-recruitDeadline'
    ).value;
    const projectStart = document.getElementById('edit-projectStart').value;
    const projectEnd = document.getElementById('edit-projectEnd').value;
    const thumbnail = document.getElementById('thumbnail').files[0];
    const content = document.getElementById('edit-content').value;
    let image;

    if (thumbnail) {
      const formData = new FormData();

      formData.append('thumbnail', thumbnail);

      await fetch('/projects/image/Upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          const { status } = response;
          if (status === 200) {
            return response.json();
          } else if (status === 500) {
            alert('썸네일 재등록에 실패하였습니다!');
            return;
          }
        })
        .then((data) => (image = data.image));
    }

    const projectInfo = {
      title,
      content,
      teamName,
      person,
      recruitDeadline,
      projectStart,
      projectEnd,
      image,
      techStack,
    };

    const response = await fetch(`/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectInfo),
    });

    const { status } = response;

    if (status === 200) {
      alert('공고가 수정되었습니다!');
    } else {
      alert('공고 등록에 실패하였습니다!');
    }

    window.location.reload();
  }
};

if (editBoardBtn) {
  editBoardBtn.addEventListener('click', () => {
    projectEditModal.showModal();
  });
}

if (projectEditModal) {
  projectEditModal.addEventListener('close', editModalData);
}
