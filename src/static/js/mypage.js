fetch(`/users/:id`)
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