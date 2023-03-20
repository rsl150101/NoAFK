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
      for (let i = 0; i < res.users.length; i++) {
        const fd = res.users[i];
        const { nickname, email, testResult, introduction, image } = fd;
        const isTestNotComplete = testResult === null;
        if (isTestNotComplete) {
          fd.testResult = '미완료';
        }
        let temp_html = `
            <div class="user-card">
              ${
                i % 2 === 0
                  ? `
                  <div class="user-card-body">
                    <div class="d-flex bd-highlight">
                      <div class="order-1 p-2 bd-highlight">
                        <h5>${nickname}</h5>
                      </div>
                      <div class="order-2 p-2 flex-grow-1 bd-highlight">
                        <h6>${email}</h6>
                      </div>
                      <div class="order-3 p-2 bd-highlight">
                        <h5>${fd.testResult}</h5>
                      </div>
                    </div>
                    ${introduction}
                  </div>
                  <img src="${image}" class="ml-3" alt="..." />
                `
                  : `
                  <img src="${image}" class="ml-3" alt="..." />
                  <div class="user-card-body">
                    <div class="d-flex bd-highlight">
                      <div class="order-1 p-2 bd-highlight">
                        <h5>${nickname}</h5>
                      </div>
                      <div class="order-2 p-2 flex-grow-1 bd-highlight">
                        <h6>${email}</h6>
                      </div>
                      <div class="order-3 p-2 bd-highlight">
                        <h5>${fd.testResult}</h5>
                      </div>
                    </div>
                    ${introduction}
                  </div>
                `
              }
            </div>`;
        document.getElementById('user_wr').innerHTML += temp_html;
      }
      usersPagination(res, isSearchParams);
    });
}
