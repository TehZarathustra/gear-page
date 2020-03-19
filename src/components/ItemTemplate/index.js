import React from 'react';

const ItemTemplate = (props) => {
	const {id, itemName, icon} = props;

	return (
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
			<div
				style={{
					fontSize: '16px',
					marginLeft: '10px',
					fontWeight: 'bold',
					marginRight: '5px'
				}}
			>
				{itemName}
			</div>
		</div>
	)
}

export default ItemTemplate;
