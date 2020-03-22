import React, {Component} from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import ItemTemplate from '../components/ItemTemplate';
import classMapper from '../utils/class-mapper';
import './styles.css';

class RaidLog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				raids: []
			},
			player: this.props.match.params.name,
			loading: true
		}

		this.renderLogs = this.renderLogs.bind(this);
	}

	componentDidMount() {
		axios.get(`/raid-log/${this.state.player}`)
			.then(({data}) => this.setState({data: data, loading: false}));
	}

	renderLogs() {
		const {raids} = this.state.data;

		return (
			<div>
				{raids.map((item) => {
					if (Array.isArray(item)) {
						return RaidLog.renderLogsByArray(item);
					}

					const {date, itemId, response, itemName, icon} = item;

					return (
						<div className="raidlog-list">
							<div className="raidlog-list__date">{date}</div>
							<div className="raidlog-list__id">
								<ItemTemplate
									id={itemId}
									itemName={itemName || item.item}
									icon={icon && icon.replace(/\s/, '').toLowerCase()}
									spec={response}
								/>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	static renderLogsByArray(arrLogs) {
		return (
			<div className="raidlog-list">
				<div className="raidlog-list__date">{arrLogs[0].date}</div>
				<div className="raidlog-list__id">
					{arrLogs.map(({itemId, itemName, icon, response, item}) => (
						<ItemTemplate
							id={itemId}
							itemName={itemName || item}
							icon={icon && icon.replace(/\s/, '').toLowerCase()}
							spec={response}
						/>
					))}
				</div>
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

	static getItemsTotal(byResponse, byRaid, data) {
		let operator;
		let comparator;

		if (byResponse) {
			operator = 'response';
			comparator = byResponse;
		}

		if (byRaid) {
			operator = 'raid';
			comparator = byRaid;
		}

		if (!operator) {
			return [];
		}

		const dataToFilterThrough = data.flatData || data.raids;

		return dataToFilterThrough.filter((item) => {
			return item[operator] === comparator;
		});
	}

	render() {
		const {data, player, loading} = this.state;
		const {raids, flatData} = data;

		const MSItems = RaidLog.getItemsTotal('Mainspec/Need', false, data);
		const OSItems = RaidLog.getItemsTotal('Offspec/Greed', false, data);

		const MCItems = RaidLog.getItemsTotal(false, 'Molten Core-40 Player', data);
		const BWLItems = RaidLog.getItemsTotal(false, 'Blackwing Lair-40 Player', data);

		return (
			<div>
				{loading && (<div className="raidlog_loading"><Loader /></div>)}
				{!loading && raids.length > 0 && (<div className="raidlog">
					<div className="raidlog__header">
						<h1 style={{color: classMapper[data.class]}}>{data.name}</h1>

						<div>
							{RaidLog.renderSummaryTemplate('Total items', (flatData || raids).length)}
							{RaidLog.renderSummaryTemplate('Mainspec', MSItems.length)}
							{RaidLog.renderSummaryTemplate('Offspec', OSItems.length)}
							{RaidLog.renderSummaryTemplate('Molten Core', MSItems.length)}
							{RaidLog.renderSummaryTemplate('Blackwing Lair', BWLItems.length)}
						</div>
					</div>
					{this.renderLogs()}
				</div>)}
				{!loading && !raids.length && (<div className="raidlog_loading">No data for {player} yet</div>)}
			</div>
		)
	}
}

export default RaidLog;
