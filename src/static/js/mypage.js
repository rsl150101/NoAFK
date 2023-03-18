fetch(`/users/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const { email, nickname, login_method, test_result, introduction, image, expired_at } = data;
    temp_html = `<div id="userInfoContent">
                  image: ${image}
                  <br>
                  <br>
                  email: ${email}
                  <br>
                  <br>
                  nickname: ${nickname}
                  <br>
                  <br>
                  로그인방법: ${login_method}
                  <br>
                  <br>
                  MBTI: ${test_result}
                  <br>
                  <br>
                  프리미엄 회원 만료일: ${expired_at}
                  <br>
                  <br>
                  자기소개: ${introduction}
                  <br>
                  <br>
                  <input type="button" onclick="updatePassword(id)" value="비밀번호 변경" />
                  <input type="button" onclick="updateNickname(id)" value="닉네임 변경" />
                  <input type="button" onclick="updateIntroduction(id)" value="자기소개 변경" />
                </div>`
    $('#userInfo').append(temp_html);
  });

fetch(`/projects/${id}/project`)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      const { Project, position } = data[i];
      let temp_html = `<tr>
                        <td>${ Project.title }</td>
                        <td>${ Project.content }</td>
                        <td>${ position }</td>
                      </tr>`
      $('#projectContent').append(temp_html);
    }
  })  

function updatePassword(id) {
  let inputPassword = prompt("변경할 비밀번호를 입력해주세요.");
  let password = inputPassword;
  fetch(`/users/${id}/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
}

function updateNickname(id) {
  let inputNickname = prompt("변경할 닉네임을 입력해주세요");
  let nickname = inputNickname;
  fetch(`/users/${id}/nickname`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });
}

function updateIntroduction(id) {
  let inputIntroduction = prompt("변경할 자기소개를 입력해주세요");
  let introduction = inputIntroduction;
  fetch(`/users/${id}/introduction`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ introduction }),
  });
}

function updateImage() {
  const inputImage = document.getElementsByName('inputImage').files[0];
  const profileImage = new FormData();
  profileImage.append('file', inputImage);
  
  fetch(`/users/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { image } = data;
      fetch(`/users/${id}/image`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      })
    })
}