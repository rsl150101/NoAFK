const projectId = Number(window.location.pathname.split('/')[2]);
const commentList = document.querySelectorAll('.comment-list');
const applyList = document.querySelectorAll('.apply-list');
const createCommentBtn = document.getElementById('create-comment-btn');
const deleteBoardBtn = document.getElementById('delete-board-btn');
const applyBtn = document.getElementById('apply-btn');
const logoutBtn = document.getElementById('logout');
const moreCommentBtn = document.getElementById('more-comment');
const CommentBox = document.getElementById('detail-comment-list');

if (cursor) {
  moreCommentBtn.style.display = 'block';
}

// 댓글 더보기
const moreComment = async () => {
  const response = await fetch(
    `/api/projects/${projectId}/comments?cursor=${cursor}`
  );
  const { comments, nextCursor } = await response.json();

  if (nextCursor === null) {
    moreCommentBtn.style.display = 'none';
  }
  cursor = nextCursor;

  comments.forEach((comment) => {
    const li = document.createElement('li');
    const nickname = document.createElement('p');
    const beforeContent = document.createElement('p');
    const afterContent = document.createElement('input');
    const timeContent = document.createElement('p');
    const beforeDiv = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const afterDiv = document.createElement('div');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    nickname.textContent = comment.nickname;
    beforeContent.setAttribute(
      'class',
      `before-click-${comment.id} display-block`
    );
    beforeContent.textContent = comment.content;
    afterContent.setAttribute(
      'class',
      `after-click-${comment.id} display-none`
    );
    afterContent.setAttribute('id', `new-comment-${comment.id}`);
    afterContent.setAttribute('value', `${comment.content}`);
    afterContent.setAttribute('required', '');

    if (comment.createdAt === comment.updatedAt) {
      timeContent.textContent = comment.createdAt;
    } else {
      timeContent.textContent = `${comment.updatedAt} (수정됨)`;
    }

    if (comment.userId === Number(loginUserId)) {
      beforeDiv.setAttribute(
        'class',
        `before-click-${comment.id} display-block`
      );
      editBtn.setAttribute('id', `check-edit-btn-${comment.id}`);
      editBtn.setAttribute('type', 'button');
      editBtn.textContent = '수정';
      deleteBtn.setAttribute('id', `delete-comment-btn-${comment.id}`);
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.textContent = '삭제';
      beforeDiv.append(editBtn, deleteBtn);

      afterDiv.setAttribute('class', `after-click-${comment.id} display-none`);
      submitBtn.setAttribute('id', `edit-comment-btn-${comment.id}`);
      submitBtn.setAttribute('type', 'button');
      submitBtn.textContent = '등록';
      cancelBtn.setAttribute('id', `cancel-edit-btn-${comment.id}`);
      cancelBtn.setAttribute('type', 'button');
      cancelBtn.textContent = '취소';
      afterDiv.append(submitBtn, cancelBtn);
    }

    li.setAttribute('class', 'comment-list');
    li.setAttribute('id', `${comment.id}`);
    li.append(
      nickname,
      beforeContent,
      afterContent,
      timeContent,
      beforeDiv,
      afterDiv
    );

    CommentBox.prepend(li);

    plusComment(comment);
    moreCommentBtn.addEventListener('click', moreComment);
  });
};

// 댓글 생성
const createComment = async () => {
  const content = document.getElementById('create-comment').value;

  await fetch(`/projects/${projectId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  window.location.reload();
};

// 댓글 수정
const editComment = async (content, commentId) => {
  await fetch(`/projects/${projectId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  window.location.reload();
};

// 댓글 삭제
const deleteComment = async (commentId) => {
  await fetch(`/projects/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  window.location.reload();
};

// 로그아웃
const logout = async () => {
  await fetch('/api/auth/logout');

  window.location.replace('/login');
};

// 참가 신청 수락
const acceptUser = async (userId) => {
  await fetch(`/projects/${projectId}/applys/${userId}`, {
    method: 'PATCH',
  });

  window.location.reload();
};

// 참가 신청
const apply = () => {
  fetch(`/projects/${projectId}/applys`, {
    method: 'POST',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });

  window.location.reload();
};

// 게시글 삭제
const deleteBoard = async () => {
  const response = await fetch(`/projects/${projectId}`, {
    method: 'DELETE',
  });

  const { status } = response;

  if (status === 204) {
    alert('공고가 삭제되었습니다!');
    window.location.href = '/';
  } else {
    alert('공고 삭제에 실패하였습니다!');
    window.location.reload();
  }
};

applyList.forEach((apply) => {
  const acceptBtn = apply.querySelector('#accept-btn');
  if (acceptBtn) {
    const userId = apply.id;

    acceptBtn.addEventListener('click', () => {
      acceptUser(userId);
    });
  }
});

function plusComment(comment) {
  const commentId = comment.id;
  const checkBtn = document.querySelector(`#check-edit-btn-${commentId}`);
  const cancelBtn = document.querySelector(`#cancel-edit-btn-${commentId}`);
  const afterBtn = document.querySelectorAll(`.after-click-${commentId}`);
  const beforeBtn = document.querySelectorAll(`.before-click-${commentId}`);
  const editCommentBtn = document.querySelector(
    `#edit-comment-btn-${commentId}`
  );
  const deleteCommentBtn = document.querySelector(
    `#delete-comment-btn-${commentId}`
  );

  if (editCommentBtn && deleteCommentBtn) {
    editCommentBtn.addEventListener('click', () => {
      const content = document.querySelector(`#new-comment-${commentId}`).value;
      editComment(content, commentId);
    });
    deleteCommentBtn.addEventListener('click', () => {
      deleteComment(commentId);
    });
  }

  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      Array.from(afterBtn).forEach((x) => {
        x.style.display = 'block';
      });
      Array.from(beforeBtn).forEach((x) => {
        x.style.display = 'none';
      });
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      Array.from(afterBtn).forEach((x) => {
        x.style.display = 'none';
      });
      Array.from(beforeBtn).forEach((x) => {
        x.style.display = 'block';
      });
    });
  }
}

if (createCommentBtn) {
  createCommentBtn.addEventListener('click', () => {
    createComment();
  });
}

if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    apply();
  });
}

if (deleteBoardBtn) {
  deleteBoardBtn.addEventListener('click', () => {
    deleteBoard();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

moreCommentBtn.addEventListener('click', moreComment);
