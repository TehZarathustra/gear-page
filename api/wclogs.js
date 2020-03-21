const axios = require('axios');
const WC_LOGS_URL = 'https://classic.warcraftlogs.com/v1/';
const API_KEY = process.env.WCLOGS_KEY;

const ZONE_MAPPER = {
	mc: 1000,
	bwl: 1001
};

function getParses(req, res) {
	const player = req.params.player;

	const zone = ZONE_MAPPER[req.params.zone];
	const url = `${WC_LOGS_URL}parses/character/${player}/ashbringer/eu?zone=${zone}&api_key=${API_KEY}`;

	return axios.get(url)
		.then(data => res.json(data.data))
		.catch(error => res.json(error))
}

function getRankings(req, res) {
	const player = req.params.player;

	const zone = ZONE_MAPPER[req.params.zone];
	const url = `${WC_LOGS_URL}rankings/character/${player}/ashbringer/eu?zone=${zone}&api_key=${API_KEY}`;

	return axios.get(url)
		.then(data => res.json(data.data))
		.catch(error => res.json(error))
}

module.exports = {
	getParses,
	getRankings
};
