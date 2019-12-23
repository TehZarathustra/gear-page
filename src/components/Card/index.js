import React from 'react';
import styles from './Card.module.css'; 
import colors from '../../utils/class-mapper';

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
	  	<div style={{color: colors[player.class]}}>{player.name || player}</div>))}
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
	      <div style={{color: '#a335ee', display: 'flex', alignItems: 'center'}}>
	        <div style={{
	          backgroundImage: 'url("https://wow.zamimg.com/images/Icon/large/border/default.png")',
	          width: "68px",
	          height: "68px",
	          display: 'flex',
	          alignItems: 'center',
	          justifyContent: 'center'
	        }}>
	          <a href={id ? `https://www.wowhead.com/item=${id}` : '#'}
	          	 data-wowhead="domain=classic"
	          	 target="_blank"
	          >
		          <div style={{
		            backgroundImage: `url("https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg")`,
		            width: '56px',
		            height: '56px'
		          }} />
	          </a>
	        </div>
	        <div style={{
	          fontSize: '16px',
	          marginLeft: '10px',
	          fontWeight: 'bold',
	          marginRight: '5px'
	        }}>{itemName}</div>
	      </div>
	      <div style={{
	        fontSize: '16px',
	        display: 'grid',
	        gridTemplateColumns: '40% 40%',
	        textAlign: 'left',
	        gridGap: '20%',
	        padding: '5px'
	      }}>
	        {playerListTemplate(enrichPlayers(data.raid1, dicts), '1st raid')}
	        {playerListTemplate(enrichPlayers(data.raid2, dicts), '2nd raid')}
	      </div>
	    </div>
	);
}

export default Card;
