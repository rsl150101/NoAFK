function updateNickname() {
  document.getElementById('nicknameModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function updatePassword() {
  document.getElementById('passwordModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function updateImage() {
  document.getElementById('imageModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function updateIntroduction() {
  document.getElementById('introductionModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// 모달 닫기 함수
function closeModalNickname() {
  document.getElementById('nicknameModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  window.location.reload();
}
function closeModalPassword() {
  document.getElementById('passwordModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  window.location.reload();
}
function closeModalImage() {
  document.getElementById('imageModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  window.location.reload();
}
function closeModalIntroduction() {
  document.getElementById('introductionModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  window.location.reload();
}

function submitNickname(id) {
  let inputNickname = document.getElementsByName('inputNickname');
  let nickname = inputNickname[0].value;
  fetch('users/' + id + '/nickname', {
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
  fetch('users/' + id + '/password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
    .then(() => {
      fetch('/api/auth/logout');
    })
    .then(() => {
      window.location.href = '/login';
    });
}

function submitIntroduction(id) {
  let inputIntroduction = document.getElementsByName('inputIntroduction');
  let introduction = inputIntroduction[0].value;
  fetch('users/' + id + '/introduction', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ introduction }),
  });
  window.location.reload();
}

function submitImage(id) {
  let inputImage = document.getElementById('inputImage').files[0];
  let formData = new FormData();
  formData.append('file', inputImage);

  fetch('/users/image', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      fetch('users/' + id + '/image', {
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
  fetch('projects/' + id + '/project')
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const { id, title, content, teamName, person, projectEnd } =
          data[i].Project;
        const { nickname } = data[i].Project.User;
        let temp_html = `<tr>
                          <th scope="row" style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;"><a href="/teams/${id}">${title}</a></th>
                          <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${content}</td>
                          <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${teamName}</td>
                          <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${nickname}</td>
                          <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${person}</td>
                          <td style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${projectEnd}</td>
                        </tr>`;
        document.getElementById('progressUserProject').innerHTML += temp_html;
      }
    });
}

window.onkeyup = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;

	if(key == 27) {
		closeModalImage();
    closeModalNickname();
    closeModalPassword();
    closeModalIntroduction();
	}
}

function setThumbnail(event) {
  var reader = new FileReader();

  reader.onload = function(event) {
    var img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    document.querySelector("div#image_container").appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
}