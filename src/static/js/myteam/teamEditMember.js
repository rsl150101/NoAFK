const url = location.pathname;

// 수정할 내용 입력
function updateMember(memberId) {
  const thPosition = document.querySelector(`#position-${memberId}`);
  const thTask = document.querySelector(`#task-${memberId}`);
  const thConfig = document.querySelector(`#config-${memberId}`);

  // 직책 - select 태그 조작
  const positionDataValue = thPosition.dataset.value;
  thPosition.innerHTML = `<select>
      <option value=1>팀원</option>
      <option value=2>부리더</option>
      <option value=3>리더</option>
      </select>`;
  for (let option of thPosition.childNodes[0]) {
    if (option.value === positionDataValue) {
      option.selected = true;
    }
  }

  // 담당업무 - input 태그 조작
  let thTaskValue = thTask.textContent;
  thTask.innerHTML = `<input type='text' value='${thTaskValue}'/>`;

  // 설정: 수정버튼 > 적용버튼
  thConfig.firstElementChild.innerHTML = `<button
                class="myteam__memberList__update"
                onclick="updateMemberApplicate(${memberId})"
              >
                ✅
              </button>`;
}

// 수정한 내용 적용
function updateMemberApplicate(memberId) {
  const select = document.querySelector(`#row-${memberId} select`);
  const inputTask = document.querySelector(`#row-${memberId} input`);
  const position = Number(select.value);
  const task = inputTask.value;

  fetch(url + `/${memberId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      position,
      task,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.updatedMember.message);
      location.reload();
    });
}
