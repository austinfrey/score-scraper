'use strict';

const cheerio = require('cheerio');
const got = require('got');

const columns = [
	'position',
	'team',
	'played',
	'won',
	'draw',
	'loss',
	'for',
	'against'
];

const getScores = (context, callback) => {
	let $;
	got('http://www.espnfc.com/english-premier-league/23/table')
		.then(html => {
			const teams = [];
			$ = cheerio.load(html.body);
			$('tbody').children('tr').each((i, elem) => {
				teams[i] = $('td', elem);
			});

			const tableArr = teams.map(elem => {
				const stats = [];
				elem.each((i, elem) => {
					stats[i] = $(elem).text().trim();
				});
				stats.splice(2, 1);
				return stats.slice(0, 8);
			});

			const table = tableArr.slice(1, 21);

			const tableObj = table.map(arr => {
				const teamObj = {};
				arr.forEach((item, i) => {
					teamObj[columns[i]] = item;
				});
				return teamObj;
			});

			callback(JSON.stringify(tableObj));
		})
		.catch(err => console.log(err));
};

module.exports = getScores
