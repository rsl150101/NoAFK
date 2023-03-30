const projectLikeBtns = document.querySelectorAll('#projectLikeBtn');

const handleProjectLike = async (btn, id) => {
  if (btn.classList.contains('project-like-btn--red')) {
    const { status } = await fetch(`/projects/${id}/like`, {
      method: 'DELETE',
    });

    if (status === 403) {
      window.location.reload();
      return;
    }
  } else {
    const { status } = await fetch(`/projects/${id}/like`, { method: 'POST' });

    if (status === 403) {
      window.location.reload();
      return;
    }
  }
  btn.classList.toggle('project-like-btn--red');
};

const handleProjectLikeBtn = (btn) => {
  const id = btn.dataset.id;

  handleProjectLike(btn, id);
};

projectLikeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    handleProjectLikeBtn(btn);
  });
});
