const projectId = Number(window.location.pathname.split('/')[2]);
const commentList = document.querySelectorAll('.comment-list');
const applyList = document.querySelectorAll('.apply-list');
const createCommentBtn = document.getElementById('create-comment-btn');
const deleteBoardBtn = document.getElementById('delete-board-btn');
const endBoardBtn = document.getElementById('end-board-btn');
const applyBtn = document.getElementById('apply-btn');
const applyCancelBtn = document.getElementById('apply-cancel-btn');
const logoutBtn = document.getElementById('logout');
const moreCommentBtn = document.getElementById('more-comment');
const CommentBox = document.getElementById('detail-comment-list');
const commentForm = document.getElementById('detail-comment');

if (cursor) {
  moreCommentBtn.style.display = 'block';
}

if (CommentBox) {
  Array.from(CommentBox.children).forEach((child) => {
    plusComment(child);
  });
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
    const nickBtn = document.createElement('div');
    const nickname = document.createElement('div');
    const beforeContent = document.createElement('pre');
    const afterContentForm = document.createElement('form');
    const afterContent = document.createElement('textarea');
    const timeDiv = document.createElement('div');
    const timeContent = document.createElement('p');
    const btn = document.createElement('div');
    const beforeDiv = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const afterDiv = document.createElement('div');
    const afterBtnDiv = document.createElement('div');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    nickBtn.setAttribute('class', 'flex justify-space-btw');
    nickname.textContent = comment.nickname;
    nickname.setAttribute('class', 'flex items-center font-bold');
    beforeContent.setAttribute(
      'class',
      `before-click-${comment.id} display-block comment-content`
    );
    beforeContent.textContent = comment.content;
    afterContent.setAttribute(
      'class',
      `w-full after-click-${comment.id} display-none comment-content`
    );
    afterContent.setAttribute('id', `new-comment-${comment.id}`);
    afterContent.setAttribute('required', '');
    afterContent.textContent = comment.content;

    if (comment.createdAt === comment.updatedAt) {
      timeContent.textContent = comment.createdAt;
    } else {
      timeContent.textContent = `${comment.updatedAt} (수정됨)`;
    }

    timeDiv.setAttribute('class', 'mr-2');
    timeDiv.append(timeContent);

    if (comment.userId === Number(loginUserId)) {
      beforeDiv.setAttribute(
        'class',
        `before-click-${comment.id} display-block btn-div`
      );
      editBtn.setAttribute('id', `check-edit-btn-${comment.id}`);
      editBtn.setAttribute('type', 'button');
      editBtn.textContent = ' 수정';
      deleteBtn.setAttribute('id', `delete-comment-btn-${comment.id}`);
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.textContent = ' 삭제';
      beforeDiv.append(editBtn, deleteBtn);

      afterBtnDiv.setAttribute('class', 'flex justify-end');
      submitBtn.textContent = '등록';
      submitBtn.setAttribute('class', 'new-btn-2 mr-2');
      cancelBtn.setAttribute('class', 'new-btn-2');
      cancelBtn.setAttribute('id', `cancel-edit-btn-${comment.id}`);
      cancelBtn.setAttribute('type', 'button');
      cancelBtn.textContent = '취소';
      afterBtnDiv.append(submitBtn, cancelBtn);
    }

    afterContentForm.setAttribute('id', `new-comment-form-${comment.id}`);
    afterContentForm.append(afterContent, afterBtnDiv);
    afterDiv.setAttribute('class', `after-click-${comment.id} display-none`);
    afterDiv.append(afterContentForm);
    btn.setAttribute('class', 'flex items-center');
    btn.append(timeContent, beforeDiv);
    nickBtn.append(nickname, btn);
    li.setAttribute('class', 'comment-list');
    li.setAttribute('id', `${comment.id}`);
    li.append(nickBtn, beforeContent, afterDiv);

    CommentBox.append(li);

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

// 참가 신청 취소
const applyCancel = (userId) => {
  fetch(`/projects/${projectId}/applys/${userId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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

// 게시글 마감
const endBoard = async () => {
  fetch(`/api/projects/${projectId}`, {
    method: 'PATCH',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === '공고 마감 완료') {
        window.location.href = '/';
      }
    });
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
  const editCommentForm = document.getElementById(
    `new-comment-form-${commentId}`
  );

  if (editCommentBtn || deleteCommentBtn) {
    editCommentForm.addEventListener('submit', () => {
      const content = document.getElementById(`new-comment-${commentId}`).value;
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

if (commentForm) {
  commentForm.addEventListener('submit', () => {
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

if (endBoardBtn) {
  endBoardBtn.addEventListener('click', () => {
    endBoard();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

if (moreCommentBtn) {
  moreCommentBtn.addEventListener('click', moreComment);
}
