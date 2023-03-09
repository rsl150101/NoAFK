(function () {
  getUserList();
})();

function getUserList() {
  fetch('/users')
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      document.querySelector('.ov_num').textContent = res.length;
      for (let i = 0; i < res.length; i++) {
        const fd = res[i];
        const { test_result, expired_at } = fd;
        const isTestNotComplete = test_result === 0;
        const isExpired = expired_at !== null;
        if (isTestNotComplete) {
          fd.test_result = '미완료';
          if (!isExpired) {
            fd.expired_at = '미완료';
          }
        } else if (!isExpired) {
          fd.expired_at = '미완료';
        }
        appendTempHtml({ ...fd });
      }
    });
}

function appendTempHtml({ ...fd }) {
  let temp_html = `<tr class="block${fd.auth_level}">
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
                    ${fd.test_result}
                    </td>
                    <td headers="user_list_expired_at" class="user_expired_at">
                      ${fd.expired_at}
                    </td>
                    <td headers="user_list_auth_level" class="user_auth_level">
                      ${fd.auth_level}
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
