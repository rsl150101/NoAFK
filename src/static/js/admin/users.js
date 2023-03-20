function getUser(pathUrl, page, sfl, stx) {
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
      usersPagination(res, isSearchParams);
    });
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
