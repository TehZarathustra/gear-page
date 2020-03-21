import React from 'react';
import styles from './Card.module.css'; 
import colors from '../../utils/class-mapper';
import ItemTemplate from '../ItemTemplate';

const {
	container,
} = styles;

function enrichPlayers(raid, dicts) {
	return raid.map((player) => {
		return dicts.players.find(({name}) => name === player) || player;
	});
}

function playerListTemplate(raid, name) {
	return (<div>
	  <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{name}</div>
	  {raid.map(player => player && (
	  	<div style={{color: colors[player.class]}}>
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
				display: 'grid',
				gridTemplateColumns: '40% 40%',
				textAlign: 'left',
				gridGap: '20%',
				padding: '5px'
			}}>
				{playerListTemplate(enrichPlayers(data.raid1, dicts), 'Sparkles ✨')}
				{playerListTemplate(enrichPlayers(data.raid2, dicts), 'Rainbows 🌈')}
			</div>
		</div>
	);
}

export default Card;
