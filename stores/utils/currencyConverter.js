const parser = require('node-html-parser');

const getExchangeRate = async () => {
  const res = await fetch('https://www.forbes.com/advisor/money-transfer/currency-converter/usd-uah');
  const page = await res.text();
  const root = parser.parse(page);
  return root.querySelector('.amount')?.innerText;
};
const convertCurrency = async (amount, rate) => {
  return amount * rate;
};

module.exports = { convertCurrency, getExchangeRate };
