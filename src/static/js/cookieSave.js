(function () {
  const cookieSearchUsers = document.cookie.replace(
    /(?:(?:^|.*;\s*)searchUsers\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  if (cookieSearchUsers !== 'null') {
    document.getElementById('stx').value =
      decodeURIComponent(cookieSearchUsers);
  }

  const cookieSelectedUsers = document.cookie.replace(
    /(?:(?:^|.*;\s*)selectedUsers\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  if (cookieSelectedUsers !== '') {
    const selectElement = document.getElementById('sfl');
    for (let i = 0; i < selectElement.options.length; i++) {
      if (
        selectElement.options[i].value ===
        decodeURIComponent(cookieSelectedUsers)
      ) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  }
})();

const formSearch = document.getElementById('formSearch');
const selectElement = document.getElementById('sfl');

formSearch.addEventListener('submit', () => {
  const searchValue = document.getElementById('stx').value;
  setCookie('searchUsers', searchValue);
});

selectElement.addEventListener('change', () => {
  const selectedValue = selectElement.value;
  document.cookie = 'selectedUsers=' + encodeURIComponent(selectedValue);
  //* 검색 셀렉트폼은 쿠키값에 저장해서 상태 유지!
});

function setCookie(name, value) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 3000); // 1분 후
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    ';expires=' +
    expires.toUTCString() +
    ';path=/';
}
