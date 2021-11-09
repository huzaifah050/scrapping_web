const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { parse } = require('json2csv');

const movies = [
	'https://www.imdb.com/title/tt1160419/?ref_=hm_fanfav_tt_t_1_pd_fp1',
	'https://www.imdb.com/title/tt1856101/?ref_=tt_sims_tt_t_2',
	'https://www.imdb.com/title/tt2543164/?ref_=tt_sims_tt_t_2',
];

(async () => {
	let imdb_data = [];

	for (let movie of movies) {
		const response = await request({
			uri: movie,
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
			},
			gzip: true,
		});

		let $ = cheerio.load(response);
		let summary = $('span[data-testid="plot-xs_to_m"]').text();
		let rating = $(
			'div[data-testid="hero-rating-bar__aggregate-rating__score"] > span'
		).text();
		let title = $('h1[data-testid="hero-title-block__title"]').text();

		imdb_data.push({
			title,
			summary,
			rating,
		});
	}

	const csv = parse(imdb_data);

	fs.writeFileSync('imdb.csv', csv, 'utf8');
})();
