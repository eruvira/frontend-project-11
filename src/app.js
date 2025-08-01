import axios from 'axios'
import * as yup from 'yup'
import i18next from 'i18next'
import onChange from './view'
import createState from './state'
import parse from './parser'
import ru from './locales/ru'
import updateFeeds from './updater'

yup.setLocale({
  string: {
    url: () => 'form.errors.url',
  },
  mixed: {
    required: () => 'form.errors.required',
    notOneOf: () => 'form.errors.duplicate',
  },
})

const makeSchema = existingUrls => yup.string().required().url().notOneOf(existingUrls)

const getProxyUrl = url => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

export default () => {
  i18next
    .init({
      lng: 'ru',
      debug: false,
      resources: { ru },
    })
    .then(() => {
      const state = createState()

      const elements = {
        form: document.getElementById('rss-form'),
        input: document.getElementById('url-input'),
        feedback: document.getElementById('feedback'),
        feedsContainer: document.getElementById('feeds'),
        postsContainer: document.getElementById('posts'),
      }

      const watchedState = onChange(state, elements)

      document.querySelectorAll('[data-i18n]').forEach((elOriginal) => {
        const el = elOriginal
        const key = el.getAttribute('data-i18n')
        el.textContent = i18next.t(key)
      })

      document
        .querySelectorAll('[data-i18n-placeholder]')
        .forEach((elOriginal) => {
          const el = elOriginal
          const key = el.getAttribute('data-i18n-placeholder')
          el.setAttribute('placeholder', i18next.t(key))
        })

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const url = formData.get('url-input').trim()
        watchedState.form.valid = false
        watchedState.form.error = null
        const existingUrls = watchedState.feeds.map(f => f.url)
        const schema = makeSchema(existingUrls)

        schema
          .validate(url)
          .then(() => axios.get(getProxyUrl(url)))
          .then((res) => {
            const { feed, posts } = parse(res.data.contents)

            watchedState.form.valid = true
            watchedState.form.error = null

            watchedState.feeds.push({
              url,
              title: feed.title,
              description: feed.description,
            })
            const enrichedPosts = posts.map(post => ({ ...post, feedUrl: url }))
            watchedState.posts.push(...enrichedPosts)

            elements.input.value = ''
            elements.input.focus()
          })
          .catch((err) => {
            watchedState.form.valid = false
            if (err.message === 'invalidRss') {
              watchedState.form.error = i18next.t('form.errors.invalidRss')
            }
            else if (err.isAxiosError) {
              watchedState.form.error = i18next.t('form.errors.network')
            }
            else if (i18next.exists(err.message)) {
              watchedState.form.error = i18next.t(err.message)
            }
            else {
              watchedState.form.error = i18next.t('form.errors.unknown')
            }
          })
      })
      elements.postsContainer.addEventListener('click', (e) => {
        const { target } = e
        if (target.tagName !== 'BUTTON') return

        const postLink = target.getAttribute('data-id')
        const post = state.posts.find(p => p.link === postLink)
        if (!post) return

        state.readPosts.add(post.link)

        const modalTitle = document.getElementById('modalTitle')
        const modalBody = document.getElementById('modalBody')
        const modalFullArticle = document.getElementById('modalFullArticle')
        modalTitle.textContent = post.title
        modalBody.textContent = post.description
        modalFullArticle.setAttribute('href', post.link)
      })

      elements.postsContainer.addEventListener('click', (e) => {
        const { target } = e

        if (target.tagName === 'A') {
          const postId = target.getAttribute('href')
          watchedState.readPosts.add(postId)
        }
      })

      const modal = document.getElementById('previewModal')
      modal.addEventListener('show.bs.modal', (e) => {
        const { relatedTarget } = e
        const postId = relatedTarget.dataset.id

        watchedState.readPosts.add(postId)
      })

      updateFeeds(watchedState)
    })
}
