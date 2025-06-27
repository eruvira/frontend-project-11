export default (rssContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssContent, 'application/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('invalidRss');
  }

  const feedTitle = doc.querySelector('channel > title')?.textContent;
  const feedDescription = doc.querySelector('channel > description')?.textContent;

  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item) => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
  }));

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };
};
