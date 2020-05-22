const {getRows} = require('../../api/google-spreadsheet');
const {
	MC_RAID_SEP_CELL,
	BWL_RAID_SEP_CELL,
	AQ_RAID_SEP_CELL,
	SPREADSHEET_CONFIG_MC,
	SPREADSHEET_CONFIG_BWL,
	SPREADSHEET_CONFIG_AQ,
	SPREADSHEET_CONFIG_PLAYERS,
	SPREADSHEET_CONFIG_ITEMS,
	SPREADSHEET_FIELDS_INDEXES
} = require('./configs');

function transformData(data, type, transformedItems, hasSeparator = true) {
	const raidMapper = {
		'Molten Core': MC_RAID_SEP_CELL,
		'Blackwing Lair': BWL_RAID_SEP_CELL,
		'AhnQiraj': AQ_RAID_SEP_CELL
	};
	const raidSepCell = raidMapper[type];

	return data.map((item, index) => {
		const players = [...item].splice(hasSeparator ? 2 : 1);
		const slicedPlayers = [...players];
		const itemName = item[SPREADSHEET_FIELDS_INDEXES.item];

		if (index > 260) {
			return {};
		}

		let dictedItem = transformedItems.find(titem => titem.name === itemName);

		return {
			item: itemName,
			all: players.filter(p => p),
			raid2: slicedPlayers.splice(raidSepCell).filter(p => p),
			raid1: slicedPlayers.filter(p => p),
			bosses: dictedItem && dictedItem.bosses,
			type
		};
	}).filter(({all, item}) => item && all.length).reduce((result, newItem) => {
		result[newItem.item] = {...newItem};

		return result;
	}, {});
}

function transformPlayersDict(players) {
	if (!players || !players.length) {
		return;
	}

	const classes = players[0];

	return players.reduce((result, item, index) => {
		if (index !== 0) {
			item.forEach((player, index) => {
				if (player) {
					result.push({
						name: player,
						class: classes[index]
					});
				}
			});
		}

		return result;
	}, []);
}

function transformItemsDict(dictItems) {
 return dictItems.map((item) => {
 	const [name, icon, id, bosses] = item;

 	if (!name) {
 		return null;
 	}

 	return {
 		name,
 		icon: icon.replace(/\s/, '').toLowerCase(),
 		id,
 		bosses: bosses && bosses.length && bosses.split(',')
 	};
 }).filter(item => item);
}

function getWishlistData(req, res) {
	return Promise.all([
			getRows(SPREADSHEET_CONFIG_MC),
			getRows(SPREADSHEET_CONFIG_PLAYERS),
			getRows(SPREADSHEET_CONFIG_ITEMS),
			getRows(SPREADSHEET_CONFIG_BWL),
			getRows(SPREADSHEET_CONFIG_AQ)
		])
		.then((data) => {
			const [mcData, players, items, bwlData, aqData] = data;
			const transformedItems = transformItemsDict(items);

			const transformedData = {
				mc: transformData(mcData, 'Molten Core', transformedItems),
				bwl: transformData(bwlData, 'Blackwing Lair', transformedItems, false),
				aq: transformData(aqData, 'AhnQiraj', transformedItems, false),
			};

			res.json({
				data: {
					...transformedData.bwl,
					...transformedData.mc,
					...transformedData.aq
				},
				dicts: {
					players: transformPlayersDict(players),
					items: transformedItems
				},
				query: req.query
			});
		})
		.catch(error => {
			console.log('error: ' + error);
		});
}

module.exports = getWishlistData;

