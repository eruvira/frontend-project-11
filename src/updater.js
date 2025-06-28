import axios from 'axios'
import i18next from 'i18next'
import parse from './parser'

const getProxyUrl = url => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

const updateFeeds = (state) => {
  const requests = state.feeds.map((feed) => {
    const proxyUrl = getProxyUrl(feed.url)
    return axios
      .get(proxyUrl)
      .then((res) => {
        state.feedUpdateError = null

        const { posts } = parse(res.data.contents)

        const existingLinks = state.posts
          .filter(post => post.feedUrl === feed.url)
          .map(post => post.link)

        const newPosts = posts
          .filter(post => !existingLinks.includes(post.link))
          .map(post => ({
            ...post,
            feedUrl: feed.url,
          }))

        if (newPosts.length > 0) {
          state.posts.push(...newPosts)
        }
      })
      .catch((error) => {
        state.feedUpdateError = i18next.t('form.errors.network')
        console.error(`Ошибка при обновлении ленты ${feed.url}:`, error)
      })
  })

  Promise.all(requests).finally(() => {
    setTimeout(() => updateFeeds(state), 5000)
  })
}

export default updateFeeds
