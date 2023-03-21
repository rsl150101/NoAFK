const searchForm = document.querySelector('form');
const searchFormInput = searchForm.querySelector('input');

const handleSearchFormSubmit = () => {
  searchFormInput.value = searchFormInput.value.trim();
};

const handleTextInput = () => {
  if (searchFormInput.value.at(0) === ' ') {
    searchFormInput.value = searchFormInput.value.trim();
  }
};

searchForm.addEventListener('submit', handleSearchFormSubmit);
searchFormInput.addEventListener('input', handleTextInput);
