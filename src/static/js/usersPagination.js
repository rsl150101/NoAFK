(function () {
  const page = new URLSearchParams(location.search).get('page') || 1;
  const sfl = new URLSearchParams(location.search).get('sfl');
  const stx = new URLSearchParams(location.search).get('stx');

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

  const pathUrl = document.URL.split('?')[0].split('/').filter(Boolean).pop();
  history.pushState({}, null, `/${pathUrl}`);

  getSearchUser(pathUrl, page, sfl, stx);
})();

const searchForm = document.getElementById('fsearch');
const selectElement = document.getElementById('sfl');

searchForm.addEventListener('submit', () => {
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

function getSearchUser(pathUrl, page, sfl, stx) {
  const isSearchParams = stx ? `${sfl}=${stx}` : null;
  let endPoint = `/users?pathUrl=${pathUrl}&page=${page}`;
  if (isSearchParams) {
    endPoint += `&sfl=${sfl}&stx=${stx}`;
  }
  fetch(endPoint)
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      const Url = res.pathUrl;
      if (Url === 'members') {
        for (let i = 0; i < res.users.length; i++) {
          const fd = res.users[i];
          const { nickname, email, testResult, introduction, image } = fd;
          const isTestNotComplete = testResult === null;
          if (isTestNotComplete) {
            fd.testResult = '미완료';
          }
          let temp_html = `
            <div class="user-card">
              ${
                i % 2 === 0
                  ? `
                  <div class="user-card-body">
                    <div class="d-flex bd-highlight">
                      <div class="order-1 p-2 bd-highlight">
                        <h5>${nickname}</h5>
                      </div>
                      <div class="order-2 p-2 flex-grow-1 bd-highlight">
                        <h6>${email}</h6>
                      </div>
                      <div class="order-3 p-2 bd-highlight">
                        <h5>${fd.testResult}</h5>
                      </div>
                    </div>
                    ${introduction}
                  </div>
                  <img src="${image}" class="ml-3" alt="..." />
                `
                  : `
                  <img src="${image}" class="ml-3" alt="..." />
                  <div class="user-card-body">
                    <div class="d-flex bd-highlight">
                      <div class="order-1 p-2 bd-highlight">
                        <h5>${nickname}</h5>
                      </div>
                      <div class="order-2 p-2 flex-grow-1 bd-highlight">
                        <h6>${email}</h6>
                      </div>
                      <div class="order-3 p-2 bd-highlight">
                        <h5>${fd.testResult}</h5>
                      </div>
                    </div>
                    ${introduction}
                  </div>
                `
              }
            </div>`;
          document.getElementById('user_wr').innerHTML += temp_html;
        }
      } else {
        document.querySelector('.ov_num').textContent = res.count;
        for (let i = 0; i < res.users.length; i++) {
          const fd = res.users[i];
          const { testResult, expiredAt } = fd;
          const isTestNotComplete = testResult === null;
          const isExpired = expiredAt !== null;
          if (isTestNotComplete) {
            fd.testResult = '미완료';
            if (!isExpired) {
              fd.expiredAt = '미완료';
            }
          } else if (!isExpired) {
            fd.expiredAt = '미완료';
          }
          appendTempHtml({ ...fd });
        }
      }

      const { currentPage, totalPages } = res;
      const pages = [];

      // 페이지 그룹의 첫번 째 페이지가 1보다 크면 이전 화살 만들기
      if (currentPage > 1) {
        pages.push(`<li class="page-item">
        <a class="page-link" href="?page=${
          currentPage - 1
        }" aria-label="Previous">
          <span aria-hidden="true">◀</span>
        </a>
      </li>`);
      }

      // 페이지 그룹의 마지막 페이지까지 페이지 숫자 렌더링 하기
      for (let i = 1; i <= totalPages; i++) {
        if (isSearchParams) {
          pages.push(
            `<li class="page-item"><a class="page-link" href='?page=${i}&sfl=${sfl}&stx=${stx}'>${i}</a></li>`
          );
        } else {
          pages.push(
            `<li class="page-item"><a class="page-link" href='?page=${i}'>${i}</a></li>`
          );
        }
      }

      // 페이지 그룹의 마지막 페이지가 총 마지막 페이지보다 작을 때 다음 화살 만들기
      if (currentPage < totalPages) {
        pages.push(`<li class="page-item">
        <a class="page-link" href='?page=${currentPage + 1}' aria-label="Next">
          <span aria-hidden="true">▶</span>
        </a>
      </li>`);
      }

      document.getElementById('pagination-wrap').innerHTML = pages.join('');
    });
}

function appendTempHtml({ ...fd }) {
  let temp_html = `<tr class="block${fd.authLevel}">
                    <td headers="user_list_id" class="user_id">${fd.id}</td>
                    <td headers="user_list_email" class="user_email">${fd.email}</td>
                    <td headers="user_list_nickname" class="user_nickname">
                      ${fd.nickname}
                    </td>
                    <td
                      headers="user_list_introduction"
                      class="user_introduction"
                    >
                    ${fd.introduction}
                    </td>
                    <td
                      headers="user_list_test_result"
                      class="user_test_result"
                    >
                    ${fd.testResult}
                    </td>
                    <td headers="user_list_expired_at" class="user_expired_at">
                      ${fd.expiredAt}
                    </td>
                    <td headers="user_list_auth_level" class="user_auth_level">
                      ${fd.authLevel}
                    </td>
                    <td headers="user_list_control" class="user_control">
                      <a class="btn btn_03" onclick="blockUser(${fd.id})">차단</a>
                      <a class="btn btn_02" onclick="deleteUser(${fd.id})">삭제</a>
                    </td>
                  </tr>`;
  document.getElementById('usersList').innerHTML += temp_html;
}

function blockUser(id) {
  fetch(`/users/${id}`, {
    method: 'PATCH',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    });
}

function deleteUser(id) {
  fetch(`/users/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    });
}
