const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const {getRows} = require('./api/google-spreadsheet');
app.use(express.static(path.join(__dirname, 'build')));
const PORT = process.env.PORT || 3000;

//
const ICONS_DICT = {
	'Arcanist Boots': 'inv_boots_07',
	'Felheart Gloves': 'inv_gauntlets_19',
	'Cenarion Boots': 'inv_boots_08',
	'Lawbringer Boots': 'inv_boots_plate_09',
	'Gauntlets of Might': 'inv_gauntlets_10',
	'Choker of Enlightenment': 'inv_jewelry_necklace_10',
	'Helm of the Lifegiver': 'inv_helmet_18',
	'Robe of Volatile Power': 'inv_chest_cloth_18',
	'Wristguards of Stability': 'inv_bracer_04',
	'Manastorm Leggings': 'inv_pants_08',
	'Salamander Scale Pants': 'inv_pants_12',
	'Heavy Dark Iron Ring': 'inv_jewelry_ring_14',
	'Ring of Spell Power': 'inv_jewelry_ring_38',
	'Pants of Prophecy': 'inv_pants_08',
	'Arcanist Leggings': 'inv_pants_08',
	'Felheart Pants': 'inv_pants_cloth_14',
	'Giantstalkers Leggings': 'inv_pants_mail_03',
	'Lawbringer Legplates': 'inv_pants_04',
	'Legplates of Might': 'inv_pants_04',
	'Medallion of Steadfast Might': 'inv_jewelry_amulet_03',
	'Strikers Mark': 'inv_weapon_bow_08',
	'Earthshaker': 'inv_hammer_04',
	'Eskhanders Right Claw': 'inv_misc_monsterclaw_04',
	'Flameguard Gauntlets': 'inv_gauntlets_26',
	'Mana Igniting Cord': 'inv_belt_11',
	'Quick Strike Ring': 'inv_jewelry_ring_07',
	'Talisman of Ephemeral Power': 'inv_misc_stonetablet_11',
	'Fire Runed Grimoire': 'inv_misc_book_09',
	'Obsidian Edged Blade': 'inv_sword_28',
	'Gloves of Prophecy': 'inv_gauntlets_14',
	'Nightslayer Gloves': 'inv_gauntlets_21',
	'Giantstalkers Boots': 'inv_boots_chain_13',
	'Lawbringer Gauntlets': 'inv_gauntlets_29',
	'Sabatons of Might': 'inv_boots_plate_04',
	'Bindings of the Windseeker': 'spell_ice_lament',
	'Arcanist Crown': 'inv_helmet_53',
	'Felheart Horns': 'inv_helmet_08',
	'Nightslayer Cover': 'inv_helmet_41',
	'Giantstalkers Helmet': 'inv_helmet_05',
	'Lawbringer Helm': 'inv_helmet_05',
	'Helm of Might': 'inv_helmet_09',
	'Drillborer Disk': 'inv_shield_10',
	'Aurastone Hammer': 'inv_hammer_05',
	'Brutality Blade': 'inv_sword_15',
	'Arcanist Mantle': 'inv_shoulder_02',
	'Felheart Shoulder Pads': 'inv_shoulder_23',
	'Lawbringer Spaulders': 'inv_shoulder_20',
	'Seal of the Archmagus': 'inv_jewelry_ring_21',
	'Boots of Prophecy': 'inv_boots_07',
	'Arcanist Gloves': 'inv_gauntlets_14',
	'Felheart Slippers': 'inv_boots_cloth_05',
	'Nightslayer Boots': 'inv_boots_08',
	'Giantstalkers Gloves': 'inv_gauntlets_10',
	'Mantle of Prophecy': 'inv_shoulder_02',
	'Nightslayer Shoulder Pads': 'inv_shoulder_25',
	'Giantstalkers Epaulets': 'inv_shoulder_10',
	'Pauldrons of Might': 'inv_shoulder_15',
	'Robes of Prophecy': 'inv_chest_cloth_03',
	'Arcanist Robes': 'inv_chest_cloth_03',
	'Felheart Robes': 'inv_chest_cloth_09',
	'Nightslayer Chestpiece': 'inv_chest_cloth_07',
	'Cenarion Vestments': 'inv_chest_cloth_06',
	'Giantstalkers Breastplate': 'inv_chest_chain_03',
	'Lawbringer Chestguard': 'inv_chest_plate03',
	'Breastplate of Might': 'inv_chest_plate16',
	'Blastershot Launcher': 'inv_weapon_rifle_09',
	'Azuresong Mageblade': 'inv_sword_39',
	'Staff of Dominance': 'inv_staff_13',
	'Wild Growth Spaulders': 'inv_shoulder_18',
	'Sash of Wispering Secrets': 'inv_belt_12',
	'Wristguards of True Flight': 'inv_bracer_02',
	'Cauterizing Band': 'inv_jewelry_ring_39',
	'Core Hound Tooth': 'inv_weapon_shortblade_11',
	'Ancient Petrified Leaf': 'spell_nature_resistnature',
	'The Eye of Divinity': 'spell_holy_mindsooth',
	'Eye of Sulfuras': 'inv_misc_gem_pearl_05',
	'Leggings of Transcendence': 'inv_pants_08',
	'Netherwind Pants': 'inv_pants_08',
	'Nemesis Leggings': 'inv_pants_07',
	'Bloodfang Pants': 'inv_pants_06',
	'Dragonstalkers Legguards': 'inv_pants_03',
	'Judement Legplates': 'inv_pants_04',
	'Legplates of Wrath': 'inv_pants_04',
	'Crown of Destuction': 'inv_crown_02',
	'Choker of the Firelord': 'inv_jewelry_amulet_05',
	'Cloak of the Shrouded Mists': 'inv_misc_cape_17',
	'Dragons Blood Cape': 'inv_misc_cape_08',
	'Onslaught Girlde': 'inv_belt_29',
	'Band of Accuria': 'inv_jewelry_ring_15',
	'Malistars Defender': 'inv_shield_08',
	'Perditions Blade': 'inv_sword_48',
	'Spinal Reaper': 'inv_axe_09',
	'Bonereavers Edge': 'inv_sword_12',
	'Girdle of Prophecy': 'inv_belt_22',
	'Arcanist Belt': 'inv_belt_30',
	'Nightslayer Belt': 'inv_belt_23',
	'Lawbringer Belt': 'inv_belt_27',
	'Belt of Might': 'inv_belt_09',
	'Vambraces of Prophecy': 'inv_bracer_09',
	'Arcanist Bindings': 'inv_belt_29',
	'Felheart Bracers': 'inv_bracer_07',
	'Lawbringer Bracers': 'inv_bracer_18',
	'Bracers of Might': 'inv_bracer_19'
};
//

// 
const SPREADSHEET_CONFIG = {
	id: '1HLqaVuc-BCdYG7ThguXs0b-mPriF6a0PFL8al12-5HE',
	range: 'Molten Core!B4:Z'
};

const SPREADSHEET_FIELDS_INDEXES = {
	item: 0,
	playersStart: 2
};
//

function transformData(data) {
	return data.map((item, index) => {
		const players = [...item].splice(2);
		const slicedPlayers = [...players];
		const itemName = item[SPREADSHEET_FIELDS_INDEXES.item];

		if (index > 259) {
			return {};
		}

		return {
			item: itemName,
			icon: ICONS_DICT[itemName],
			all: players.filter(p => p),
			raid2: slicedPlayers.splice(15).filter(p => p),
			raid1: slicedPlayers.filter(p => p)
		};
	}).filter(({all, item}) => item && all.length).reduce((result, {item, all, raid1, raid2, icon}) => {
		result[item] = {
			all,
			raid1,
			raid2,
			icon
		};

		return result;
	}, {});
}

app.get('/data', function (req, res) {
	console.log('gett >>>>>>>>');

	return getRows(SPREADSHEET_CONFIG)
		.then(data => {
			res.json({data: transformData(data)})
		})
		.catch(error => {
			console.log('error: ' + error);
		});
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
