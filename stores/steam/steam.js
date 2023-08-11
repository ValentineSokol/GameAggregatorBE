const adapter = require('./adapter');
const scrapeGame = require('./gamePageScraper');

const baseUrl = 'https://store.steampowered.com/';

const searchGame = async (term) => {
  const url = `${baseUrl}/search/suggest?term=${term}&f=games&cc=UA&realm=1&l=english&v=17350928&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&use_store_query=1&use_search_spellcheck=1`;
  const res = await fetch(url);
  return adapter(await res.text());
};
module.exports = {
  searchGame,
  scrapeGame,
};
