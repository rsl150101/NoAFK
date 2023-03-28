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
  let idRegExp = /^[A-za-z0-9가-힣]{1,20}$/;
  if (!nickname) {
    return alert("변경할 닉네임을 입력해주세요.")
  } else if (!idRegExp.test(nickname)) {
    return alert("닉네임은 한글, 영어 대소문자 숫자가 가능하며, 특수문자와 공백이 불가능합니다. 닉네임 길이는 1~20자입니다.")
  } else {
    fetch('users/' + id + '/nickname', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    });
    window.location.reload();
  }
}

function submitPassword(id) {
  let inputPassword = document.getElementsByName('inputPassword');
  let password = inputPassword[0].value;
  let pwRegExp = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!password) {
    return alert("변경할 패스워드를 입력해주세요.")
  } else if (!pwRegExp.test(password)) {
    return alert("비밀번호는 특수문자를 무조건 포함해야하며, 최소 8자 이상 입력해야합니다.")
  } else {
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

function updatePrivateStatus(id) {
  const privateStatus = document.getElementById("private").innerText.split(" ")[1];
  if (privateStatus === "공개") {
    fetch('users/' + id + '/privateEmail', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ privateEmail: false }),
    });
    window.location.reload();
  } else if (privateStatus === "비공개") {
    fetch('users/' + id + '/privateEmail', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ privateEmail: true }),
    });
    window.location.reload();
  } else {
    alert("임의적인 조작은 사용불가합니다.");
  }
}