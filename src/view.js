import onChange from 'on-change'
import i18next from 'i18next'

const renderFormState = (elements, form) => {
  const { input, feedback } = elements
  if (form.valid) {
    input.classList.remove('is-invalid')
    feedback.classList.remove('text-danger')
    feedback.classList.add('text-success')
    feedback.textContent = i18next.t('form.success') }
  else {
    input.classList.add('is-invalid')
    feedback.classList.remove('text-success')
    feedback.classList.add('text-danger')
    feedback.textContent = i18next.t(`${form.error}`)
  }
}

const renderFeeds = (feeds, containerVal) => {
  const container = containerVal
  container.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('border-0')

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')

  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')

    const title = document.createElement('h3')
    title.classList.add('h6', 'm-0')
    title.textContent = feed.title

    const desc = document.createElement('p')
    desc.classList.add('m-0', 'small', 'text-black-50')
    desc.textContent = feed.description

    li.append(title, desc)
    ul.appendChild(li)
  })

  card.appendChild(ul)
  container.appendChild(card)
}

const renderPosts = (posts, readPosts, containerVal) => {
  const container = containerVal
  container.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('border-0')

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')

  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    )

    const link = document.createElement('a')
    link.setAttribute('href', post.link)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    if (readPosts.has(post.link)) {
      link.classList.add('fw-normal', 'text-secondary') }
    else {
      link.classList.add('fw-bold')
    }
    link.textContent = post.title

    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.textContent = i18next.t('posts.preview')
    button.setAttribute('data-id', post.link)
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#previewModal')

    li.append(link, button)
    ul.appendChild(li)
  })

  card.appendChild(ul)
  container.appendChild(card)
}

export default (state, elements) =>
  onChange(state, (path) => {
    switch (path) {
      case 'form.valid':
      case 'form.error':
        renderFormState(elements, state.form)
        break

      case 'feeds':
        renderFeeds(state.feeds, elements.feedsContainer)
        break

      case 'posts':
      case 'readPosts':
        renderPosts(state.posts, state.readPosts, elements.postsContainer)
        break

      default:
        break
    }
  })
