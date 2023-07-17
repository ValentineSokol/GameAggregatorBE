const STORES = require('../STORES');
const { convertCurrency, getExchangeRate } = require('../utils/currencyConverter');

const adapter = async (gogResponse) => {
  const exchangeRate = await getExchangeRate();
  const priceConversions = gogResponse?.products.map((game) => convertCurrency(game?.price?.final?.slice(1), exchangeRate));
  const prices = await Promise.all(priceConversions);

  return gogResponse.products?.map((game, i) => ({
    name: game?.title,
    price: `${game?.price?.final} (${Math.round(prices[i])}₴)`,
    url: `https://www.gog.com/en/game/${game?.slug.split('-').join('_')}`,
    store: STORES.GOG,
  }));
};

module.exports = adapter;
