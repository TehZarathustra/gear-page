const {getRows} = require('../../api/google-spreadsheet');
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

function transformEntryItem(item) {
	return {
		name: item[nameIndex],
		date: item[dateIndex],
		time: item[timeIndex],
		item: item[itemIndex],
		itemId: item[itemIdIndex],
		itemString: item[itemStringIndex],
		response: item[responseIndex],
		votes: item[votesIndex],
		class: item[classIndex],
		raid: item[raidIndex],
		boss: item[bossIndex]
	};
}

function transformLog(data) {
	return data.reduce((result, item) => {
		const entry = transformEntryItem(item);

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
		])
		.then((data) => {
			const [lootLog] = data;

			if (player) {
				return res.json(transformLog(lootLog)[`${player}-Ashbringer`]);
			}

			return res.json(transformLog(lootLog));
		});
}

module.exports = getRaidLog;
