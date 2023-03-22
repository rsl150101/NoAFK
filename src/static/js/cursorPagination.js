const projectsBox = document.getElementById('projectsBox');

const handleScroll = async () => {
  let end = projectsBox.clientHeight + Math.round(projectsBox.scrollTop);
  if (!cursor) {
    projectsBox.removeEventListener('scroll', handleScroll);
    return;
  }
  if (end >= projectsBox.scrollHeight) {
    projectsBox.removeEventListener('scroll', handleScroll);
    const response = await fetch(
      `http://localhost:3000/api/projects?cursor=${cursor}&site=${site}&search=${search}`
    );
    const { nextCursor, projects } = await response.json();
    cursor = nextCursor;
    projects.forEach((project) => {
      const li = document.createElement('li');
      const h1 = document.createElement('h1');
      const pre = document.createElement('pre');
      const div = document.createElement('div');
      const ownerh4 = document.createElement('h4');
      const createdAth4 = document.createElement('h4');
      const ownerSpan = document.createElement('span');
      const createdAtSpan = document.createElement('span');

      h1.textContent = project.title;
      pre.textContent = project.content;
      ownerh4.textContent = '소유자';
      createdAth4.textContent = '등록일';
      ownerSpan.textContent = project.owner;
      createdAtSpan.textContent = project.createdAt;

      div.append(ownerh4, ownerSpan, createdAth4, createdAtSpan);
      li.append(h1, pre, div);
      projectsBox.appendChild(li);

      projectsBox.addEventListener('scroll', handleScroll);
    });
  }
};

projectsBox.addEventListener('scroll', handleScroll);
