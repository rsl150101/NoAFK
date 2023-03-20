const projectDelBtns = document.querySelectorAll('#projectRow button');
const searchForm = document.querySelector('form');
const searchFormInput = searchForm.querySelector('input');

const handleDelBtn = async (id) => {
  const { status } = await fetch(`http://localhost:3000/admin/projects/${id}`, {
    method: 'DELETE',
  });
  if (status === 204) {
    alert('프로젝트가 삭제되었습니다.');
    window.location.reload();
  } else {
    alert('해당 프로젝트가 없습니다.');
  }
};

const handleSearchFormSubmit = (event) => {
  searchFormInput.value = searchFormInput.value.trim();
  console.log(searchFormInput.value);
  if (searchFormInput.value === '') {
    event.preventDefault();
    searchFormInput.setCustomValidity('공백으로 검색할 수 없습니다.');
    searchFormInput.reportValidity();
    searchFormInput.setCustomValidity('');
  }
};

projectDelBtns.forEach((btn) =>
  btn.addEventListener('click', () => {
    handleDelBtn(btn.dataset.id);
  })
);

searchForm.addEventListener('submit', handleSearchFormSubmit);
