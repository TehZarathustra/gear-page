import React, {Component} from 'react';
import axios from 'axios';
import Loader from '../Loader';
import RankingsCard from '../RankingsCard';
// import ItemTemplate from '../components/ItemTemplate';
// import RankingsCard from '../components/RankingsCard';
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
			loot: [],
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
	}

	onClose() {
		this.props.onClose(this.state.name);
	}

	onSpecChange(e, item) {
		this.setState({spec: item});
	}

	renderRankings() {
		const {data, spec} = this.state;

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
		const {name, data} = this.state;
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
					<div>
						<a
							href={`/player/${name}`}
							className="player-card__name"
							style={{color: color}}
						>
							{name}
						</a>
						<div className="player-card__class">{playerClass}</div>
					</div>
					{this.renderRankings()}
				</div>
				{/*<div>
					Recent items
				</div>*/}
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
