const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const {getRows} = require('./api/google-spreadsheet');
const iconMapper = require('./api/icon-mapper');
const idMapper = require('./api/id-mapper');
const PORT = process.env.PORT || 3000;
const SPREADSHEET_ID = '1HLqaVuc-BCdYG7ThguXs0b-mPriF6a0PFL8al12-5HE';

const SPREADSHEET_CONFIG = {
	id: '1HLqaVuc-BCdYG7ThguXs0b-mPriF6a0PFL8al12-5HE'
};

const SPREADSHEET_CONFIG_MC = {
	...SPREADSHEET_CONFIG,
	range: 'Molten Core!B4:Z'
};

const SPREADSHEET_CONFIG_ONY = {
	...SPREADSHEET_CONFIG,
	range: 'Onyxia!B4:Z'
};

const SPREADSHEET_FIELDS_INDEXES = {
	item: 0,
	playersStart: 2
};

function transformData(data, type) {
	const MC_RAID_SEP_CELL = 15;
	const ONY_RAID_SEP_CELL = 11;
	const raidMapper = {
		'Molten Core': MC_RAID_SEP_CELL,
		'Onyxia': ONY_RAID_SEP_CELL
	};
	const raidSepCell = raidMapper[type];

	return data.map((item, index) => {
		const players = [...item].splice(2);
		const slicedPlayers = [...players];
		const itemName = item[SPREADSHEET_FIELDS_INDEXES.item];

		if (index > 259) {
			return {};
		}

		return {
			item: itemName,
			icon: iconMapper[itemName],
			id: idMapper[itemName],
			all: players.filter(p => p),
			raid2: slicedPlayers.splice(raidSepCell).filter(p => p),
			raid1: slicedPlayers.filter(p => p)
		};
	}).filter(({all, item}) => item && all.length).reduce((result, {item, all, raid1, raid2, icon, id}) => {
		result[item] = {
			all,
			raid1,
			raid2,
			icon,
			id,
			type
		};

		return result;
	}, {});
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/data', function (req, res) {
	return Promise.all([getRows(SPREADSHEET_CONFIG_MC), getRows(SPREADSHEET_CONFIG_ONY)])
		.then((data) => {
			const [mcData, OnyData] = data;
			const transformedData = {
				mc: transformData(mcData, 'Molten Core'),
				ony: transformData(OnyData, 'Onyxia')
			};

			res.json({data: {...transformedData.mc, ...transformedData.ony}});
		})
		.catch(error => {
			console.log('error: ' + error);
		});
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
