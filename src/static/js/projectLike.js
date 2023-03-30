const projectLikeBtns = document.querySelectorAll('#projectLikeBtn');

const handleProjectLikeBtn = async (btn) => {
  const id = btn.dataset.id;
  if (btn.classList.contains('project-like-btn--red')) {
    const { status } = await fetch(`/projects/${id}/like`, {
      method: 'DELETE',
    });

    if (status === 403) {
      window.location.reload();
    }
  } else {
    const { status } = await fetch(`/projects/${id}/like`, { method: 'POST' });

    if (status === 403) {
      window.location.reload();
    }
  }
  btn.classList.toggle('project-like-btn--red');
};

projectLikeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    handleProjectLikeBtn(btn);
  });
});
