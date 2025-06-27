import onChange from 'on-change';
import i18next from 'i18next';

const renderFeeds = (feeds, container) => {
  const el = container
  el.innerHTML = '';
  feeds.forEach(({ title, description }) => {
    const feedEl = document.createElement('div');
    feedEl.classList.add('mb-3');

    const feedTitle = document.createElement('h5');
    feedTitle.textContent = title;

    const feedDesc = document.createElement('p');
    feedDesc.textContent = description;

    feedEl.append(feedTitle, feedDesc);
    container.appendChild(feedEl);
  });
};

const renderPosts = (posts, container) => {
  const el = container
  el.innerHTML = '';
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach(({ title, link }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.textContent = title;

    li.appendChild(a);
    ul.appendChild(li);
  });

  container.appendChild(ul);
};

const renderFormState = (elements, formState) => {
  const { input, feedback } = elements;

  if (formState.valid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18next.t('form.success');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = formState.error;
  }
};

export default (state, elements) => onChange(state, (path) => {
  if (path === 'form.valid' || path === 'form.error') {
    renderFormState(elements, state.form);
  }

  if (path === 'feeds') {
    renderFeeds(state.feeds, elements.feedsContainer);
  }

  if (path === 'posts') {
    renderPosts(state.posts, elements.postsContainer);
  }
});
