(function () {
  const page = new URLSearchParams(location.search).get('page') || 1;
  const sfl = new URLSearchParams(location.search).get('sfl');
  const stx = new URLSearchParams(location.search).get('stx');

  const pathUrl = window.location.pathname;
  history.pushState({}, null, `${pathUrl}`);

  getUser(pathUrl, page, sfl, stx);
})();

function usersPagination(res, isSearchParams) {
  const { currentPage, totalPages } = res;
  const pages = [];

  // 페이지 그룹의 첫번 째 페이지가 1보다 크면 이전 화살 만들기
  if (currentPage > 1) {
    pages.push(`<li class="page-item">
        <a class="page-link" href="?page=${
          currentPage - 1
        }" aria-label="Previous">
          <span aria-hidden="true">◀</span>
        </a>
      </li>`);
  }

  // 페이지 그룹의 마지막 페이지까지 페이지 숫자 렌더링 하기
  for (let i = 1; i <= totalPages; i++) {
    if (isSearchParams) {
      pages.push(
        `<li class="page-item"><a class="page-link" href='?page=${i}&sfl=${sfl}&stx=${stx}'>${i}</a></li>`
      );
    } else {
      pages.push(
        `<li class="page-item"><a class="page-link" href='?page=${i}'>${i}</a></li>`
      );
    }
  }

  // 페이지 그룹의 마지막 페이지가 총 마지막 페이지보다 작을 때 다음 화살 만들기
  if (currentPage < totalPages) {
    pages.push(`<li class="page-item">
        <a class="page-link" href='?page=${currentPage + 1}' aria-label="Next">
          <span aria-hidden="true">▶</span>
        </a>
      </li>`);
  }

  document.getElementById('pagination-wrap').innerHTML = pages.join('');
}
