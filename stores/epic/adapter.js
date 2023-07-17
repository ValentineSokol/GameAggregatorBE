const STORES = require('../STORES.js');

const adapter = (epicResponse = {}) => {
  const data = epicResponse.data?.Catalog?.searchStore?.elements;
  return data.map((game) => ({
    name: game.title,
    price: `${game.currentPrice / 100}₴`,
    url: `https://store.epicgames.com/en-US/p/${game.urlSlug}`,
    store: STORES.EPIC,
  }));
};

module.exports = adapter;
