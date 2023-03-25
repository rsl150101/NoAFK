const projectAddBtn = document.getElementById('projectAddBtn');
const projectAddModal = document.getElementById('projectAddModal');
const ModalCancelBtn = document.getElementById('modalCancelBtn');
const projectAddModalForm = document.getElementById('projectAddModalForm');
const errorMessage = document.getElementById('errorMessage');
const recruitDeadlineDate = document.getElementById('recruitDeadline');
const projectStartDate = document.getElementById('projectStart');
const projectEndDate = document.getElementById('projectEnd');
const thumbnailImage = document.getElementById('thumbnail');

const handleProjectAddBtn = () => {
  if (!owner) {
    alert('로그인이 필요합니다!');
    window.location.href = '/login';
    return;
  }
  projectAddModal.showModal();
  return;
};

const handleClickThumbnailImage = () => {
  thumbnailImage.setCustomValidity('');
};

const handleInputThumbnailImage = () => {
  const { type } = thumbnailImage.files[0];
  if (type !== 'image/jpeg' && type !== 'image/png') {
    thumbnailImage.setCustomValidity('jpg/jpeg/png 만 지원합니다!');
    thumbnailImage.reportValidity();
    thumbnailImage.value = '';
    return;
  }

  return;
};

const handleModalClose = (clickValue) => {
  projectAddModal.close();
  projectAddModal.returnValue = clickValue;
};

const handleChangeDateValidity = () => {
  recruitDeadlineDate.setCustomValidity('');
  projectStartDate.setCustomValidity('');
  projectEndDate.setCustomValidity('');
};

const handleModalSubmit = (event) => {
  event.preventDefault();

  const now = new Date().getTime();
  const deadLine = new Date(recruitDeadlineDate.value).getTime();
  const projectStart = new Date(projectStartDate.value).getTime();
  const projectEnd = new Date(projectEndDate.value).getTime();

  if (deadLine < now) {
    recruitDeadlineDate.setCustomValidity(
      '마감 기한을 현재 시간보다 작거나 같게 설정할 수 없습니다.'
    );
    recruitDeadlineDate.reportValidity();
    return;
  }

  if (deadLine > projectStart) {
    recruitDeadlineDate.setCustomValidity('마감 기한이 올바르지 않습니다.');
    recruitDeadlineDate.reportValidity();
    return;
  }

  if (projectStart > projectEnd || projectStart === projectEnd) {
    projectStartDate.setCustomValidity('프로젝트 기간이 올바르지 않습니다.');
    projectStartDate.reportValidity();
    return;
  }

  handleModalClose('register');
  return;
};

const postModalData = async () => {
  if (projectAddModal.returnValue === 'register') {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const teamName = document.getElementById('teamName').value;
    const techStack = document.getElementById('techStack').value;
    const person = document.getElementById('person').value;
    const recruitDeadline = recruitDeadlineDate.value;
    const projectStart = projectStartDate.value;
    const projectEnd = projectEndDate.value;
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
      window.location.reload();
    } else {
      alert('공고 등록에 실패하였습니다!');
    }
  }
  return;
};

projectAddBtn.addEventListener('click', handleProjectAddBtn);
ModalCancelBtn.addEventListener('click', () => {
  handleModalClose('close');
});
recruitDeadlineDate.addEventListener('change', handleChangeDateValidity);
projectStartDate.addEventListener('change', handleChangeDateValidity);
projectEndDate.addEventListener('change', handleChangeDateValidity);
thumbnailImage.addEventListener('click', handleClickThumbnailImage);
thumbnailImage.addEventListener('input', handleInputThumbnailImage);
projectAddModalForm.addEventListener('submit', handleModalSubmit);
projectAddModal.addEventListener('close', postModalData);
