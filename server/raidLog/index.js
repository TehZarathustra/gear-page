const {getRows} = require('../../api/google-spreadsheet');
const moment = require('moment');
const axios = require('axios');
const {
	LOOT_CONFIG_SPARKLES,
	nameIndex,
	dateIndex,
	timeIndex,
	itemIndex,
	itemIdIndex,
	itemStringIndex,
	responseIndex,
	votesIndex,
	classIndex,
	raidIndex,
	bossIndex
} = require('./configs');
const {
	SPREADSHEET_CONFIG_ITEMS,
	SPREADSHEET_CONFIG_PLAYER_LIST
} = require('../wishlist/configs');

function transformEntryItem(item, itemList) {
	let enrichedData = {};

	const dictData = itemList.find(dictItem => dictItem[2]
		=== (item[itemIdIndex] === '18423' ? '18422' : item[itemIdIndex]));

	if (dictData && dictData.length) {
		const [itemName, icon, id] = dictData;

		enrichedData = {
			itemName, icon, id
		};
	} else {
		// console.log('not found', item);
	}

	const momentDate = moment(item[dateIndex], 'DD/MM/YYYY');

	return {
		name: item[nameIndex],
		date: momentDate.format('LL'),
		momentDate,
		time: item[timeIndex],
		item: item[itemIndex],
		itemId: item[itemIdIndex],
		itemString: item[itemStringIndex],
		response: item[responseIndex],
		votes: item[votesIndex],
		class: item[classIndex],
		raid: item[raidIndex],
		boss: item[bossIndex],
		...enrichedData
	};
}

function transformLog(data, itemList) {
	return Object.values(data.reduce((result, item) => {
		const entry = transformEntryItem(item, itemList);

		if (!result[entry.name]) {
			result[entry.name] = {
				name: entry.name,
				class: entry.class,
				raids: [entry]
			};
		} else {
			result[entry.name].raids.push(entry);
		}

		return result;
	}, {raids: []})).map((item) => {
		return {
			...item,
			raids: item.raids && item.raids.sort((a, b) => a.momentDate.diff(b.momentDate))
		}
	});
}

function getPlayerRankings(player, zone, req, res) {
	let metric = 'dps';

	const paramPlayer = req.param('player');
	const paramZone = req.param('zone');

	const url = `http://${req.headers.host}/rankings/${zone || paramZone}/${metric}/${player || paramPlayer}`;

	return axios.get(url)
		.then((dpsData) => {
			if (dpsData.data.find(({spec}) => spec === 'Healer')) {
				metric = 'hps';
				return axios.get(url)
					.then((hpsData) => {
						const result = {
							DPS: dpsData.data,
							Healer: hpsData.data
						};

						if (res) {
							return res.json(result);
						}

						return result;
					});
			}

			const result = {DPS: dpsData.data};

			if (res) {
				return res.json(result);
			}

			return result;
		});
}

function getItemsByPlayer(req, res) {
	const player = req.param('player');

	return Promise.all([
			getRows(LOOT_CONFIG_SPARKLES),
			getRows(SPREADSHEET_CONFIG_ITEMS)
		])
		.then((data) => {
			const [lootLog, itemList] = data;
			const transformedLog = transformLog(lootLog, itemList);
			const logByplayer = transformedLog.find(item => item.name === `${player}-Ashbringer`);

			if (logByplayer) {
				logByplayer.flatData = [...logByplayer.raids];
				logByplayer.raids = Object.values(logByplayer.raids.reduce((result, item) => {
					if (result[item.date]) {
						const itemToSpread = Array.isArray(result[item.date]) ? result[item.date] : [result[item.date]];

						result[item.date] = [...itemToSpread, item];
					} else {
						result[item.date] = item;
					}

					return result;
				}, {}));
			}

			return res.json(logByplayer || {raids: [], flatData: []});
		});
}

function getRaidLog(req, res) {
	const player = req.param('player');

	return Promise.all([
			getRows(LOOT_CONFIG_SPARKLES),
			getRows(SPREADSHEET_CONFIG_ITEMS),
			player ? getPlayerRankings(player, 'bwl', req) : null,
			player ? getPlayerRankings(player, 'mc', req) : null,
			player ? getPlayerRankings(player, 'ony', req) : null,
		])
		.then((data) => {
			const [lootLog, itemList, bwlRankings, mcRankings, onyRankings] = data;
			const transformedLog = transformLog(lootLog, itemList);

			if (player) {
				const logByplayer = transformedLog.find(item => item.name === `${player}-Ashbringer`);

				if (logByplayer) {
					logByplayer.flatData = [...logByplayer.raids];
					logByplayer.raids = Object.values(logByplayer.raids.reduce((result, item) => {
						if (result[item.date]) {
							const itemToSpread = Array.isArray(result[item.date]) ? result[item.date] : [result[item.date]];

							result[item.date] = [...itemToSpread, item];
						} else {
							result[item.date] = item;
						}

						return result;
					}, {}));

					logByplayer.rankings = {
						mc: mcRankings,
						bwl: bwlRankings,
						ony: onyRankings
					};
				}

				return res.json(logByplayer || {raids: [], flatData: []});
			}

			return res.json(transformedLog);
		});
}

function getPlayerList(req, res) {
	return getRows(SPREADSHEET_CONFIG_PLAYER_LIST)
		.then((list) => {
			return res.json(list.filter(player => player[1]
				&& player[1] === 'Sparkles'
				|| player[1] === 'Rainbows'
				|| player[1] === 'Trial')
				.map((player) => {
					const [name, raid, level, playerClass] = player;

					return {name, raid, playerClass};
				}));
		});
}

module.exports = {
	getRaidLog,
	getItemsByPlayer,
	getPlayerList,
	getPlayerRankings
};
