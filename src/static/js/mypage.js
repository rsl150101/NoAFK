const { response } = require("express");

function updateNickname() {
  document.getElementById("nicknameModal").style.display = "block";
  document.body.style.overflow = "hidden"
}
function updatePassword() {
  document.getElementById("passwordModal").style.display = "block";
  document.body.style.overflow = "hidden"
}
function updateImage() {
  document.getElementById("imageModal").style.display = "block";
  document.body.style.overflow = "hidden"
}
function updateIntroduction() {
  document.getElementById("introductionModal").style.display = "block";
  document.body.style.overflow = "hidden"
}

// 모달 닫기 함수
function closeModalNickname() {
  document.getElementById("nicknameModal").style.display = "none";
  document.body.style.overflow = "auto"
}
function closeModalPassword() {
  document.getElementById("passwordModal").style.display = "none";
  document.body.style.overflow = "auto"
}
function closeModalImage() {
  document.getElementById("imageModal").style.display = "none";
  document.body.style.overflow = "auto"
}
function closeModalIntroduction() {
  document.getElementById("introductionModal").style.display = "none";
  document.body.style.overflow = "auto"
}

function submitNickname(id) {
  let inputNickname = document.getElementsByName('inputNickname');
  let nickname = inputNickname[0].value;
  fetch('users/'+id+'/nickname', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });
  window.location.reload();
}

function submitPassword(id) {
  let inputPassword = document.getElementsByName('inputPassword');
  let password = inputPassword[0].value;
  fetch('users/'+id+'/password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
  .then(() => {
    fetch('/api/auth/logout')
  })
  .then(() => {
    window.location.href = '/';
  })
}

function submitIntroduction(id) {
  let inputIntroduction = document.getElementsByName('inputIntroduction');
  let introduction = inputIntroduction[0].value;
  fetch('users/'+id+'/introduction', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ introduction }),
  });
  window.location.reload();
}

function submitImage(id) {
  let inputImage = document.getElementById("inputImage").files[0];
  let formData = new FormData();
  formData.append('file', inputImage)

  fetch('/users/image', {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then((data) => {
    fetch('users/'+id+'/image', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: data.image }),
    });
    window.location.reload();
  });
}

function getInfo(id) {
  fetch('projects/'+ id + '/project')
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const { id, title, content, teamName, owner, person, projectEnd } = data[i].Project;
        let temp_html = `<tr>
                          <th scope="row"><a href="/projects/${id}">${title}</a></th>
                          <td>${content}</td>
                          <td>${teamName}</td>
                          <td>${owner}</td>
                          <td>${person}</td>
                          <td>${projectEnd}</td>
                        </tr>`
        document.getElementById('progressUserProject').innerHTML += temp_html;
      }
    })
}