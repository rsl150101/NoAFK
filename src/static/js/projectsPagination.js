const urlSearch = new URLSearchParams(location.search);
const projectsBox = document.getElementById('projectsBox');
const paginationBox = document.getElementById('pagination');

let page = urlSearch.get('page') || 1;

//+ 클라이언트가 임의로 접속하는 URL 에 대한 처리
if (page <= 0) {
  page = 1;
}

const prevPage = page >= 10 ? (Math.floor(page / 10) - 1) * 10 + 1 : 1;
let nextPage = (Math.floor(page / 10) + 1) * 10 + 1;

if (page) {
  fetch(`/api/projects?page=${page}&site=notices`)
    .then((response) => response.json())
    .then((projectsAndPageArr) => {
      const {
        projects,
        pageInfo: { pageArr, totalPage },
      } = projectsAndPageArr;

      const firstPageBtn = document.createElement('a');
      const lastPageBtn = document.createElement('a');
      const prevPageBtn = document.createElement('a');
      const nextPageBtn = document.createElement('a');

      projects.forEach((project) => {
        const li = document.createElement('li');
        const h1 = document.createElement('h1');
        const p = document.createElement('p');
        const footer = document.createElement('footer');
        const ownerSpan = document.createElement('span');
        const createdAtSpan = document.createElement('span');

        //todo <김우중> <2023.03.03> : 프로필 이미지는 추후 유저 조회 기능이 합쳐졌을 때 수정하겠습니다.
        // const img = document.createElement('img');

        h1.textContent = project.title;
        p.textContent = project.content;

        //todo <김우중> <2023.03.03> : 프로젝트 소유자 칼럼이 추가되면 수정하겠습니다.
        // ownerSpan.textContent = project.owner

        ownerSpan.textContent = '소유자'; //- 임시구현
        createdAtSpan.textContent = project.createdAt;

        footer.append(ownerSpan, createdAtSpan);
        li.append(h1, p, footer);
        projectsBox.appendChild(li);
      });

      firstPageBtn.href = '?page=1&site=notices';
      firstPageBtn.classList.add('fa-solid', 'fa-angles-left');
      lastPageBtn.href = `?page=${totalPage}&site=notices`;
      lastPageBtn.classList.add('fa-solid', 'fa-angles-right');

      //+ 편의를 위해서 임시 구현
      //todo <김우중> <2023.03.04> : 추후에 버튼 이벤트로 페이지네이션 이전, 다음 기능 통합해서 클린 코드하기
      if (page <= 10) {
        prevPageBtn.addEventListener('click', () => {
          alert('이전 페이지가 없습니다. 첫 페이지 : 1');
          return;
        });
      }
      if (nextPage > totalPage) {
        nextPage = Math.floor(totalPage / 10) * 10 + 1;
        nextPageBtn.addEventListener('click', () => {
          alert(`다음 페이지가 없습니다. 마지막 페이지 : ${totalPage}`);
          return;
        });
      }

      prevPageBtn.href = `?page=${prevPage}&site=notices`;
      prevPageBtn.classList.add('fa-solid', 'fa-angle-left');
      nextPageBtn.href = `?page=${nextPage}&site=notices`;
      nextPageBtn.classList.add('fa-solid', 'fa-angle-right');

      paginationBox.append(firstPageBtn, prevPageBtn);
      pageArr.forEach((page) => {
        const aTag = document.createElement('a');
        aTag.href = `?page=${page}&site=notices`;
        aTag.textContent = page;
        paginationBox.appendChild(aTag);
      });
      paginationBox.append(nextPageBtn, lastPageBtn);
    });
}
