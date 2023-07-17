const adapter = require('./adapter.js');

const baseUrl = 'https://catalog.gog.com';

const searchGame = async (term) => {
    const response = await fetch(`${baseUrl}/v1/catalog?query=like%3A${term}&order=desc%3Ascore&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=UA&locale=en-US&currencyCode=USD`);
    const data = await response.json();
    return adapter(data);
}

module.exports = { searchGame };