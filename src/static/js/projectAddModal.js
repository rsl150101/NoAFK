const projectAddBtn = document.getElementById('projectAddBtn');
const projectAddModal = document.getElementById('projectAddModal');
const ModalCancelBtn = document.getElementById('modalCancelBtn');

const handleProjectAddBtn = () => {
  if (!owner) {
    alert('로그인이 필요합니다!');
    window.location.href = '/login';
    return;
  }
  projectAddModal.showModal();
  return;
};

const handleModalCancelBtn = () => {
  projectAddModal.close();
  projectAddModal.returnValue = 'cancel';
};

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
    const thumbnail = document.getElementById('thumbnail').files[0];
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
            alert('공고 등록에 실패하였습니다!');
            return;
          }
        })
        .then((data) => (image = data.image));
    }

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
      image,
    };

    const response = await fetch('/projects', {
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
  return;
};

projectAddBtn.addEventListener('click', handleProjectAddBtn);
ModalCancelBtn.addEventListener('click', handleModalCancelBtn);
projectAddModal.addEventListener('close', postModalData);
