import React, {Component} from 'react';
import axios from 'axios';
import ItemTemplate from '../components/ItemTemplate';
import classMapper from '../utils/class-mapper';
import './styles.css';

class RaidLog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				raids: []
			}
		}

		this.renderLogs = this.renderLogs.bind(this);
	}

	componentDidMount() {
		axios.get(`raid-log/Villain`)
			.then(data => this.setState(data));
	}

	renderLogs() {
		const {raids} = this.state.data;

		return (
			<div>
				{raids.map((item) => {
					const {date, itemId, response, itemName, icon} = item;

					return (
						<div className="raidlog-list">
							<div className="raidlog-list__date">{date}</div>
							<div className="raidlog-list__id">
								<ItemTemplate
									id={itemId}
									itemName={itemName}
									icon={icon.replace(/\s/, '').toLowerCase()}
									spec={response}
								/>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	static renderSummaryTemplate(text, number) {
		return (
			<div className="raidlog-summary__item">
				<div className="raidlog-summary__heading">
					{text}
				</div>
				<div className="raidlog-summary__count">
					{number}
				</div>
			</div>
		);
	}

	render() {
		const {data} = this.state;
		const {raids} = data;

		const MSItems = raids.filter(({response}) => response === 'Mainspec/Need');
		const OSItems = raids.filter(({response}) => response === 'Offspec/Greed');
		const MCItems = raids.filter(({raid}) => raid === 'Molten Core-40 Player');
		const BWLItems = raids.filter(({raid}) => raid === 'Blackwing Lair-40 Player');

		return (
			<div className="raidlog">
				<div className="raidlog__header">
					<h1 style={{color: classMapper[data.class]}}>{data.name}</h1>

					<div>
						{RaidLog.renderSummaryTemplate('total items received', raids.length)}
						{RaidLog.renderSummaryTemplate('Mainspec', MSItems.length)}
						{RaidLog.renderSummaryTemplate('Offspec received', OSItems.length)}
						{RaidLog.renderSummaryTemplate('Molten Core', MSItems.length)}
						{RaidLog.renderSummaryTemplate('Blackwing Lair', BWLItems.length)}
					</div>
				</div>
				{this.renderLogs()}
			</div>
		)
	}
}

export default RaidLog;
