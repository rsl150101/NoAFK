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

function updatePassword(id, password) {
  fetch(`/users/${id}/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
}

function updateNickname(id, nickname) {
  fetch(`/users/${id}/nickname`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });
}

function updateIntroduction(id, introduction) {
  fetch(`/users/${id}/introduction`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ introduction }),
  });
}