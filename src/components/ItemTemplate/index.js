import React from 'react';

const ItemTemplate = (props) => {
	const {id, itemName, icon, spec} = props;

	return (
		<div style={{display: 'flex', alignItems: 'center', position: 'relative', padding: '10px 10px 0 10px'}}>
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
						height: '56px',
						backgroundColor: 'dimgray'
					}} />
				</a>
			</div>
			<div
				style={{
					fontSize: '16px',
					marginLeft: '10px',
					fontWeight: 'bold',
					marginRight: '5px',
					color: icon ? '#a335ee' : 'cornflowerblue',
					textAlign: 'left'
				}}
			>
				{itemName}
			</div>
			{spec && (<div style={{position: 'absolute', top: '14px', left: '88px', color: '#fff', fontSize: '12px', whiteSpace: 'nowrap', opacity: '50%'}}>{spec}</div>)}
		</div>
	)
}

export default ItemTemplate;
