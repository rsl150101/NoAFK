(function () {
  const page = new URLSearchParams(location.search).get('page') || 1;
  const sfl = new URLSearchParams(location.search).get('sfl');
  const stx = new URLSearchParams(location.search).get('stx');
  const cookieSearchAdminUsers = document.cookie.replace(
    /(?:(?:^|.*;\s*)searchAdminUsers\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  if (cookieSearchAdminUsers !== 'null') {
    document.getElementById('stx').value = decodeURIComponent(
      cookieSearchAdminUsers
    );
  }

  const cookieSelectedAdminUsers = document.cookie.replace(
    /(?:(?:^|.*;\s*)selectedAdminUsers\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  if (cookieSelectedAdminUsers !== '') {
    const selectElement = document.getElementById('sfl');
    for (let i = 0; i < selectElement.options.length; i++) {
      if (
        selectElement.options[i].value ===
        decodeURIComponent(cookieSelectedAdminUsers)
      ) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  }
  getUserList(page, sfl, stx);
})();

const searchForm = document.getElementById('fsearch');
const selectElement = document.getElementById('sfl');

searchForm.addEventListener('submit', () => {
  const searchValue = document.getElementById('stx').value;
  setCookie('searchAdminUsers', searchValue);
});

selectElement.addEventListener('change', () => {
  const selectedValue = selectElement.value;
  document.cookie = 'selectedAdminUsers=' + encodeURIComponent(selectedValue);
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

function getUserList(page, sfl, stx) {
  const isSearchParams = stx ? `${sfl}=${stx}` : null;
  let endPoint = `/users?page=${page}`;
  if (isSearchParams) {
    endPoint = `/users?page=${page}&sfl=${sfl}&stx=${stx}`;
  }
  fetch(endPoint)
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
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

      const { currentPage, totalPages } = res;
      const pages = [];

      // 페이지 그룹의 첫번 째 페이지가 1보다 크면 이전 화살 만들기
      if (currentPage > 1) {
        pages.push(`<li class="page-item">
        <a class="page-link" href="?page=${
          currentPage - 1
        }" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
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
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`);
      }

      $('#pagination-wrap').append(pages.join(''));
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
