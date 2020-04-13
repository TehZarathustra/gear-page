const MC_RAID_SEP_CELL = 13;
const ONY_RAID_SEP_CELL = 11;
const BWL_RAID_SEP_CELL = 16;
const ZG_RAID_SEP_CELL = 11;

const SPREADSHEET_CONFIG = {
	id: '1HLqaVuc-BCdYG7ThguXs0b-mPriF6a0PFL8al12-5HE'
};

const SPREADSHEET_CONFIG_MC = {
	...SPREADSHEET_CONFIG,
	range: 'Molten Core!B4:AF260'
};

const SPREADSHEET_CONFIG_ONY = {
	...SPREADSHEET_CONFIG,
	range: 'Onyxia!B4:Z'
};

const SPREADSHEET_CONFIG_BWL = {
	...SPREADSHEET_CONFIG,
	range: 'Blackwing Lair!A2:Z139'
};

const SPREADSHEET_CONFIG_ZG = {
	...SPREADSHEET_CONFIG,
	range: 'ZulGurub!A2:Z59'
};

const SPREADSHEET_CONFIG_PLAYERS = {
	...SPREADSHEET_CONFIG,
	range: 'Molten Core!A500:I530'
};

const SPREADSHEET_CONFIG_PLAYER_LIST = {
	...SPREADSHEET_CONFIG,
	range: 'Roster!A2:E1000'
};

const SPREADSHEET_CONFIG_ITEMS = {
	...SPREADSHEET_CONFIG,
	range: 'Gear!AZ1:BC350'
};

const SPREADSHEET_FIELDS_INDEXES = {
	item: 0,
	playersStart: 2
};

module.exports = {
	MC_RAID_SEP_CELL,
	ONY_RAID_SEP_CELL,
	BWL_RAID_SEP_CELL,
	ZG_RAID_SEP_CELL,
	SPREADSHEET_CONFIG_MC,
	SPREADSHEET_CONFIG_ONY,
	SPREADSHEET_CONFIG_BWL,
	SPREADSHEET_CONFIG_ZG,
	SPREADSHEET_CONFIG_PLAYERS,
	SPREADSHEET_CONFIG_ITEMS,
	SPREADSHEET_FIELDS_INDEXES,
	SPREADSHEET_CONFIG_PLAYER_LIST
};
