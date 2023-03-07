function submit() {
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
  let MBTI_RESULT = MBTI.join('');
  if (MBTI_RESULT) {
    $('#mbti_submit').empty();
    temp_html = `<br>
                  <div id="progress">
                      <div id="progress-container">
                      <div id="progress-bar"></div>
                    </div>
                  </div>
                <br>`
  }
  $('#mbti_progress').append(temp_html);
  if(temp_html) {
    start(MBTI_RESULT);
  }
}

let i = 0;
function start(mbti) {
    if (i === 0) {
        i = 1;
        let elem = document.getElementById("progress-bar");
        let width = 0;
        let id = setInterval(frame, 10);

        function frame() {
            if (width === 100) {
                i = 0;
                temp_html = `<div>
                              MBTI 결과는 ${mbti} 입니다.
                            </div>
                            <br>
                            <a href="#"><input type="button" value="다음" /><a>`
                $('#mbti_result').append(temp_html);
              clearInterval(id)
            } else {
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
            }
        }
    }
}