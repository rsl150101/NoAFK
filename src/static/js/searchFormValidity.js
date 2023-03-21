const searchForm = document.querySelector('form');
const searchFormInput = searchForm.querySelector('input');

const handleSearchFormSubmit = (event) => {
  searchFormInput.value = searchFormInput.value.trim();
  if (searchFormInput.value === '') {
    event.preventDefault();
    searchFormInput.setCustomValidity('공백으로 검색할 수 없습니다.');
    searchFormInput.reportValidity();
    searchFormInput.setCustomValidity('');
  }
};

searchForm.addEventListener('submit', handleSearchFormSubmit);
