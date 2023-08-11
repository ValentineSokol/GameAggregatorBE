const parser = require('node-html-parser');

const scrape = async (url) => {
  const headers = new Headers();
  headers.append('Accept-Language', 'uk-ua');
  const res = await fetch(url, { headers });
  const html = await res.text();
  const root = parser.parse(html);

  const targets = [
    { key: 'name', selector: '.apphub_AppName' },
    { key: 'description', selector: '.game_description_snippet' },
    { key: 'releaseDate', selector: '.date' },
    { key: 'coverUrl', selector: '.game_header_image_full' },
  ];

  return targets.reduce((acc, cur) => {
    if (cur.key === 'coverUrl') {
      acc.coverUrl = root.querySelector(cur.selector)?.attributes?.src;
      return acc;
    }
    acc[cur.key] = root.querySelector(cur.selector)?.textContent;
    return acc;
  }, {});
};

module.exports = scrape;
