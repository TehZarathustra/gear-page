import React from 'react';
import styles from './Card.module.css'; 
import colors from '../../utils/class-mapper';
import ItemTemplate from '../ItemTemplate';

const {
	container,
	listStyles
} = styles;

function enrichPlayers(raid, dicts) {
	return raid.map((player) => {
		return dicts.players.find(({name}) => name === player) || player;
	});
}

function playerListTemplate(raid, name) {
	return (<div style={{display: 'flex', flexWrap: 'wrap'}}>
		{raid.map(player => player && (
		<div style={{color: colors[player.class]}} className={listStyles}>
			<a style={{textDecoration: 'none', color: 'inherit'}} href={`/player/${player.name || player}`}>{player.name || player}</a>
		</div>))}
	</div>);
}

const Card = (props) => {
	const {itemName, data, dicts} = props;
	const dictedItem = dicts.items.find((dictItem) => dictItem.name === itemName);

	if (!dictedItem) {
		return (<div>none</div>);
	}

	const {id, icon} = dictedItem;

	return (
		<div className={container}>
			<ItemTemplate
				id={id}
				icon={icon}
				itemName={itemName}
			/>
			<div style={{
				fontSize: '16px',
				textAlign: 'left',
				padding: '5px'
			}}>
				{playerListTemplate(enrichPlayers(data.raid1, dicts), '')}
			</div>
		</div>
	);
}

export default Card;
