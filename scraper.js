const got = require('got');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function getData() {
  const response = await got('https://en.wikipedia.org/wiki/Politics_of_the_United_Kingdom');

  const dom = new JSDOM(response.body);
  const { window } = dom;
  const { document } = window;

  const parties = [];

  const table = document.querySelector('#mw-content-text > div.mw-parser-output > table.wikitable > tbody');
  const tbody = Array.from(table.querySelectorAll('tr'));

  tbody.slice(1).forEach((tr, i) => {
    //Initialize object
    const party = {};

    //Convert node list to array
    const td = Array.from(tr.querySelectorAll('td'));
    const titles = document
      .querySelector('#mw-content-text > div.mw-parser-output > table.wikitable > tbody ')
      .querySelectorAll('th');

    const labels = [];

    titles.forEach((title, i) => {
      labels.push(title.textContent.trim());

      if (titles[3].textContent.trim() == 'Regions served') {
        titles[3].textContent = 'Regions_served';
      }
    });
    const smalls = labels.map(title => title.toLowerCase());

    td.forEach((text, j) => {
      let value = text.firstChild.textContent.trim();

      //replacements
      let numValue = Number(value.replace(/[,+]/g, ''));

      if (!isNaN(numValue)) {
        value = numValue;
      }

      const label = smalls[j];
      //get first child to omit references from wikipedia
      party[label] = value;
    });

    parties.push(party);
  });

  //return array to be awaited
  return parties;
}

module.exports = { getData };
