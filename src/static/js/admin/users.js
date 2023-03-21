// '차단' 버튼 클릭 이벤트 핸들러 등록
let blockUserButtons = document.querySelectorAll('.block-user');
blockUserButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    let userId = button.getAttribute('data-user-id');
    blockUser(userId);
  });
});

// '삭제' 버튼 클릭 이벤트 핸들러 등록
let deleteUserButtons = document.querySelectorAll('.delete-user');
deleteUserButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    let userId = button.getAttribute('data-user-id');
    deleteUser(userId);
  });
});

function blockUser(id) {
  fetch(`/admin/users/${id}`, {
    method: 'PATCH',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    });
}

function deleteUser(id) {
  fetch(`/admin/users/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    });
}
