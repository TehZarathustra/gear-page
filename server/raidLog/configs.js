const SPREADSHEET_CONFIG_SPARKLES = {
	id: '1poZdVN5sNpUIqfIMqC1giyqT_TI-UMHi0euuJqf4Row'
};

const LOOT_CONFIG_SPARKLES = {
	...SPREADSHEET_CONFIG_SPARKLES,
	range: 'Sheet1!A2:K10000'
};

const INDEXES = {
	nameIndex: 0,
	dateIndex: 1,
	timeIndex: 2,
	itemIndex: 3,
	itemIdIndex: 4,
	itemStringIndex: 5,
	responseIndex: 6,
	votesIndex: 7,
	classIndex: 8,
	raidIndex: 9,
	bossIndex: 10 
};

module.exports = {
	LOOT_CONFIG_SPARKLES,
	...INDEXES
};
