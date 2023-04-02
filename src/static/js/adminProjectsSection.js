const projectDelBtns = document.querySelectorAll('#projectRow button');

const handleDelBtn = async (id) => {
  const { status } = await fetch(`/admin/projects/${id}`, {
    method: 'DELETE',
  });
  if (status === 204) {
    alert('프로젝트가 삭제되었습니다.');
    window.location.reload();
  } else {
    alert('해당 프로젝트가 없습니다.');
  }
};

projectDelBtns.forEach((btn) =>
  btn.addEventListener('click', () => {
    handleDelBtn(btn.dataset.id);
  })
);
