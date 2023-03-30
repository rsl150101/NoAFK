const projectLikeBtns = document.querySelectorAll('#projectLikeBtn');

const handleProjectLikeBtn = async (btn) => {
  const id = btn.dataset.id;
  if (btn.classList.contains('project-like-btn--red')) {
    await fetch(`/projects/${id}/like`, { method: 'DELETE' });
  } else {
    await fetch(`/projects/${id}/like`, { method: 'POST' });
  }
  btn.classList.toggle('project-like-btn--red');
};

projectLikeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    handleProjectLikeBtn(btn);
  });
});
