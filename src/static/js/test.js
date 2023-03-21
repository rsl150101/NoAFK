function reSelect() {
  window.location.reload();
}

function submitTest(id) {
  let IE = document.getElementsByName('IE');
  let NS = document.getElementsByName('NS');
  let TF = document.getElementsByName('TF');
  let PJ = document.getElementsByName('PJ');
  for (let i = 0; i < IE.length; i++) {
    if(IE[i].checked) {
      MBTI_IE = IE[i].value;
    }
  }
  for (let i = 0; i < NS.length; i++) {
    if(NS[i].checked) {
      MBTI_NS = NS[i].value;
    }
  }
  for (let i = 0; i < TF.length; i++) {
    if(TF[i].checked) {
      MBTI_TF = TF[i].value
    }
  }
  for (let i = 0; i < PJ.length; i++) {
    if(PJ[i].checked) {
      MBTI_PJ = PJ[i].value
    }
  }
  const MBTI = [MBTI_IE, MBTI_NS, MBTI_TF, MBTI_PJ];
  let testResult = MBTI.join('');
  fetch('/api/test/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ testResult }),
  });
  window.location.href = '/mypage';
}