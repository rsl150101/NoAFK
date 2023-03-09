(function () {
  const page = new URLSearchParams(location.search).get('page') || 1;
  getUserList(page);
})();

function getUserList(page) {
  fetch(`/users/page?page=${page}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
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
        pages.push(
          `<li class="page-item"><a class="page-link" href='?page=${i}'>${i}</a></li>`
        );
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
