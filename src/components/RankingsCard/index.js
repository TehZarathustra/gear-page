import React from 'react';
import classNames from 'classnames';
import './styles.css';

const PECENILE_COLORING = {
	gold: {
		color: '#e5cc80',
		range: 100
	},
	pinky: {
		color: 'rgb(226,104,168)',
		range: 99
	},
	orange: {
		color: '#ff8000',
		range: 95
	},
	purple: {
		color: '#a335ee',
		range: 75
	},
	blue: {
		color: '#0070dd',
		range: 50
	},
	green: {
		color: '#1eff00',
		range: 25
	},
	gray: {
		color: '#9d9d9d',
		range: 0
	}
};

function getPercentileColor(percentile) {
	return Object.values(PECENILE_COLORING)
		.find((item, index) => {
			return percentile.toFixed(0) >= item.range;
		}).color;
}

const RankingsCard = (props) => {
	const {title, data} = props;
	const averagePerformance = data.length
		&& data.reduce((a, b) => {
				return a + Number(b.percentile.toFixed(0))
			}, 0) / data.length;
	const averagePerformanceColor = averagePerformance
		&& getPercentileColor(averagePerformance);

	return (
		<div style={props.style}>
			{title && (<div className="rankings__title">{title}</div>)}
			<div style={{display: 'flex', alignItems: 'center'}}>
				<div className="rankings__items">
					{data.map((item) => {
						const {encounterName, percentile} = item;
						const imageName = encounterName.replace(/\s/g, '');
						const percentileColor = getPercentileColor(percentile);

						const imageClasses = classNames({
							rankings__image: true,
							[`rankings_${imageName}`]: true
						});

						return (
							<div className="rankings__item">
								<div className={imageClasses} />
								<div className="rankings__percentile" style={{color: percentileColor}}>{percentile.toFixed(2)}</div>
							</div>
						);
					})}
				</div>
				{data.length > 1 && (<div className="rankings__average" style={{color: averagePerformanceColor}}>
					{averagePerformance.toFixed(1)}
				</div>)}
			</div>
		</div>
	);
}

export default RankingsCard;
