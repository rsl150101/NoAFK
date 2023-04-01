const projectsBox = document.getElementById('projectsBox');

const handleScroll = async () => {
  let end = projectsBox.clientHeight + Math.round(projectsBox.scrollTop);

  if (end >= projectsBox.scrollHeight) {
    projectsBox.removeEventListener('scroll', handleScroll);
    const response = await fetch(
      `/api/projects?cursor=${cursor}&site=${site}&search=${search}`
    );
    const { nextCursor, projects } = await response.json();
    cursor = nextCursor;

    projects.forEach((project) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const h1 = document.createElement('h1');
      const pre = document.createElement('pre');
      const div = document.createElement('div');
      const techStackDiv = document.createElement('div');
      const ownerh4 = document.createElement('h4');
      const createdAth4 = document.createElement('h4');
      const ownerSpan = document.createElement('span');
      const createdAtSpan = document.createElement('span');

      a.href = `/projects/${project.id}`;
      h1.textContent = project.title;
      pre.textContent = project.content;
      techStackDiv.textContent = project.techStack;
      ownerh4.textContent = '등록자';
      createdAth4.textContent = '등록일';
      ownerSpan.textContent = project['User.nickname'];
      createdAtSpan.textContent = project.createdAt;

      div.append(techStackDiv, ownerh4, ownerSpan, createdAth4, createdAtSpan);
      a.append(h1, pre, div);

      if (owner) {
        const likeBtn = document.createElement('button');

        likeBtn.id = 'projectLikeBtn';
        likeBtn.classList.add('project-like-btn');
        likeBtn.type = 'button';
        likeBtn.dataset.id = project.id;

        likeBtn.insertAdjacentHTML(
          'afterbegin',
          '<i class="fa-solid fa-heart"></i>'
        );

        likeBtn.addEventListener('click', () => {
          handleProjectLike(likeBtn, project.id);
        });

        if (project.like) {
          likeBtn.classList.add('project-like-btn--red');
        }

        li.append(a, likeBtn);
      } else {
        li.appendChild(a);
      }

      projectsBox.appendChild(li);

      projectsBox.addEventListener('scroll', handleScroll);
    });

    if (!cursor) {
      projectsBox.removeEventListener('scroll', handleScroll);

      const li = document.createElement('li');
      const span = document.createElement('span');

      span.textContent = '더 이상 공고가 없습니다.';
      li.classList.add('no-more-project');

      li.appendChild(span);
      projectsBox.appendChild(li);

      return;
    }
  }
};

projectsBox.addEventListener('scroll', handleScroll);
