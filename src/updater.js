import axios from 'axios'
import i18next from 'i18next'
import parse from './parser'

const getProxyUrl = url => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

const updateFeeds = (state) => {
  const feedUpdateState = state

  const requests = feedUpdateState.feeds.map((feed) => {
    const proxyUrl = getProxyUrl(feed.url)

    return axios
      .get(proxyUrl)
      .then((res) => {
        feedUpdateState.feedUpdateError = null

        const { posts } = parse(res.data.contents)

        const existingLinks = feedUpdateState.posts
          .filter(post => post.feedUrl === feed.url)
          .map(post => post.link)

        const newPosts = posts
          .filter(post => !existingLinks.includes(post.link))
          .map(post => ({
            ...post,
            feedUrl: feed.url,
          }))

        if (newPosts.length > 0) {
          feedUpdateState.posts.push(...newPosts)
        }
      })
      .catch((error) => {
        feedUpdateState.feedUpdateError = i18next.t('form.errors.network')
        console.error(`Ошибка при обновлении ленты ${feed.url}:`, error)
      })
  })

  Promise.all(requests).finally(() => {
    setTimeout(() => updateFeeds(feedUpdateState), 5000)
  })
}

export default updateFeeds
