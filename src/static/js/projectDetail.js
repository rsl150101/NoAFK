const projectId = Number(window.location.pathname.split('/')[2]);
const commnetList = document.querySelectorAll('.comment-list');
const applyList = document.querySelectorAll('.apply-list');
const createCommentBtn = document.getElementById('create-comment-btn');
const deleteBoardBtn = document.getElementById('delete-board-btn');
const applyBtn = document.getElementById('apply-btn');
const logoutBtn = document.getElementById('logout');
const checkBtn = document.getElementById('check-edit-btn');
const cancelBtn = document.getElementById('cancel-edit-btn');
const afterBtn = document.querySelectorAll('.after-click');
const beforeBtn = document.querySelectorAll('.before-click');

applyList.forEach((apply) => {
  const acceptBtn = apply.querySelector('#accept-btn');
  if (acceptBtn) {
    const userId = apply.id;

    acceptBtn.addEventListener('click', () => {
      acceptUser(userId);
    });
  }
});

commnetList.forEach((comment) => {
  const editCommentBtn = comment.querySelector('#edit-comment-btn');
  const deleteCommentBtn = comment.querySelector('#delete-comment-btn');
  const commentId = comment.id;

  if (editCommentBtn && deleteCommentBtn) {
    editCommentBtn.addEventListener('click', () => {
      const content = comment.querySelector('#new-comment').value;
      editComment(content, commentId);
    });
    deleteCommentBtn.addEventListener('click', () => {
      deleteComment(commentId);
    });
  }
});

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

logoutBtn.addEventListener('click', () => {
  logout();
});

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
