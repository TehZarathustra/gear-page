import React from 'react';
import styles from './Card.module.css'; 

const {
	container,
} = styles;

const Card = (props) => {
	const {itemName, data} = props;

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
	          <div style={{
	            backgroundImage: `url("https://wow.zamimg.com/images/wow/icons/large/${data.icon}.jpg")`,
	            width: '56px',
	            height: '56px'
	          }} />
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
	        <div>
	          <div style={{fontWeight: 'bold', marginBottom: '5px'}}>1st raid</div>
	          {data.raid1.map(player => (<div>{player}</div>))}
	        </div>
	        <div>
	          <div style={{fontWeight: 'bold', marginBottom: '5px'}}>2nd raid</div>
	          {data.raid2.map(player => (<div>{player}</div>))}
	        </div>
	      </div>
	    </div>
	);
}

export default Card;
