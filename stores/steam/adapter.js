const parser = require('node-html-parser');

const STORES = require('../STORES');

const adapter = (steamResponse) => {
  const targetClasses = ['match_name', 'match_subtitle'];
  const root = parser.parse(steamResponse);

  const matches = root.querySelectorAll('a');

  return matches.map((match) => targetClasses.reduce((acc, cur) => {
    acc.url = match.attributes.href;
    const key = cur.includes('subtitle') ? 'price' : cur.split('_')[1];
    acc[key] = match.querySelector(`.${cur}`)?.innerText;
    if (acc.price) {
      acc.price = `${acc.price.split('₴')[0]}₴`;
    }
    return acc;
  }, { store: STORES.STEAM }));
};

module.exports = adapter;
