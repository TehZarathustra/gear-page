import React, {Component} from 'react';
import axios from 'axios';
import Loader from '../Loader';
import RankingsCard from '../RankingsCard';
import RaidLog from '../../RaidLog';
import classMapper from '../../utils/class-mapper';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './styles.css';

class PlayerCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {},
			loading: true,
			spec: '',
			loot: {},
			name: props.id,
			error: ''
		};

		this.onClose = this.onClose.bind(this);
		this.renderRankings = this.renderRankings.bind(this);
		this.onSpecChange = this.onSpecChange.bind(this);
	}

	componentDidMount() {
		const {name} = this.state;

		axios.get(`/rankings/bwl/${name}/`)
			.then(({data}) => this.setState({data: data, loading: false}))
			.catch(() => this.setState({error: 'Something went wrong', loading: false}, () => {
				setTimeout(() => this.onClose(), 3000);
			}));

		axios.get(`/items/${name}/`)
			.then(({data}) => this.setState({loot: data}));
	}

	onClose() {
		this.props.onClose(this.state.name);
	}

	onSpecChange(e, item) {
		this.setState({spec: item});
	}

	renderTotalItems(loot) {
		const {flatData, raids} = loot;

		if (!flatData || !flatData.length) {
			return (<div style={{marginTop: '15px', fontSize: '12px'}}>No loot entries yet</div>);
		}

		const MSItems = RaidLog.getItemsTotal('Mainspec/Need', false, loot);
		const MCItems = RaidLog.getItemsTotal(false, 'Molten Core-40 Player', loot);
		const BWLItems = RaidLog.getItemsTotal(false, 'Blackwing Lair-40 Player', loot);

		return (
			<div style={{marginTop: '15px'}}>
				{RaidLog.renderSummaryTemplate('Total items', (flatData || raids).length)}
				{RaidLog.renderSummaryTemplate('Mainspec', MSItems.length)}
				{RaidLog.renderSummaryTemplate('Molten Core', MSItems.length)}
				{RaidLog.renderSummaryTemplate('Blackwing Lair', BWLItems.length)}
			</div>
		);
	}

	static latestItemTemplate({date, item, itemName, itemId, response}) {
		return (
			<div className="latest-items">
				<div className="latest-items__date">{date}</div>
				<div className="latest-items__link">
					<a
						href={`https://www.wowhead.com/item=${itemId}`}
						data-wowhead="domain=classic"
						target="_blank"
					>
						{itemName || item}
					</a>
				</div>
				<div className="latest-items__response">{response}</div>
			</div>
		);
	}

	renderLatestItems(loot, amount) {
		if (!loot || !loot.flatData || !loot.flatData.length) {
			return null;
		}

		const listItems = Object.values({...loot.flatData}).splice(-amount);

		return (
			<div style={{textAlign: 'left', marginTop: '10px'}}>
				<div style={{fontSize: '14px'}}>Recent items</div>
				<div style={{marginTop: '10px'}}>
					{listItems.map(data => PlayerCard.latestItemTemplate(data))}
				</div>
			</div>
		);
	}

	renderRankings() {
		const {data, spec} = this.state;

		if (!data.length) {
			return null;
		}

		const specs = Object.values(data.reduce((result, item) => {
			result[item.spec] = item.spec;

			return result;
		}, {}));
		const value = spec || specs[0];
		const specToRender = data.filter(item => item.spec === value);

		return (
			<div>
				<RadioGroup
					className="player-card__specs"
					aria-label="spec"
					name="spec"
					value={value}
					onChange={this.onSpecChange}
				>
					{specs.map((item) => {
						return (
							<FormControlLabel value={item} control={<Radio />} label={item} />
						);
					})}
				</RadioGroup>
				<RankingsCard data={specToRender} theme="compact" />
			</div>
		);
	}

	renderCard() {
		const {name, data, loot} = this.state;
		const {onClose} = this.props;
		let color = 'white';
		let playerClass;

		if (data && data.length) {
			playerClass = data[0].class;
			color = classMapper[playerClass.toUpperCase()];
		}

		return (
			<div style={{width: '100%'}}>
				<CloseIcon className="player-card__close" onClick={this.onClose} />
				<div className="player-card__rankings">
					<div style={{textAlign: 'left'}}>
						<a
							href={`/player/${name}`}
							className="player-card__name"
							style={{color: color}}
						>
							{name}
						</a>
						<div className="player-card__class">{playerClass}</div>
						{this.renderTotalItems(loot)}
					</div>
					{this.renderRankings()}
				</div>
				{this.renderLatestItems(loot, 3)}
			</div>
		);
	}

	render() {
		const {loading, name, error} = this.state;

		return (
			<div className="player-card">
				{loading && (<div className="player-card__loader"><Loader /></div>)}
				{!loading && !error && (this.renderCard())}
				{error && (<div className="player-card__loader">{error}</div>)}
			</div>
		);
	}
}

export default PlayerCard;
