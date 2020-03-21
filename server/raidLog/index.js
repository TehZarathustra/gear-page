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

	const dictData = itemList.find(dictItem => dictItem[2] === item[itemIdIndex]);

	if (dictData && dictData.length) {
		const [itemName, icon, id] = dictData;

		enrichedData = {
			itemName, icon, id
		};
	}

	return {
		name: item[nameIndex],
		date: moment(item[dateIndex], 'DD/MM/YYYY').format('LL'),
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
	return data.reduce((result, item) => {
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
	}, {});
}

function getRaidLog(req, res) {
	const player = req.param('player');

	return Promise.all([
			getRows(LOOT_CONFIG_SPARKLES),
			getRows(SPREADSHEET_CONFIG_ITEMS)
		])
		.then((data) => {
			const [lootLog, itemList] = data;

			if (player) {
				return res.json(transformLog(lootLog, itemList)[`${player}-Ashbringer`]);
			}

			return res.json(transformLog(lootLog, itemList));
		});
}

module.exports = getRaidLog;
