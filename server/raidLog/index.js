const {getRows} = require('../../api/google-spreadsheet');
const moment = require('moment');
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
const {SPREADSHEET_CONFIG_ITEMS} = require('../wishlist/configs');

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
		console.log('not found', item);
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

function getRaidLog(req, res) {
	const player = req.param('player');

	return Promise.all([
			getRows(LOOT_CONFIG_SPARKLES),
			getRows(SPREADSHEET_CONFIG_ITEMS)
		])
		.then((data) => {
			const [lootLog, itemList] = data;
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
				}

				return res.json(logByplayer || {raids: [], flatData: []});
			}

			return res.json(transformedLog);
		});
}

module.exports = getRaidLog;
