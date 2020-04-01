import React, {Component} from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import PlayerCard from '../components/PlayerCard';

class Ranks extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedPlayer: '',
			players: [],
			playersDict: []
		};

		this.onPlayerChange = this.onPlayerChange.bind(this);
		this.onPlayerClose = this.onPlayerClose.bind(this);
	}

	componentDidMount() {
		axios.get('/player-list/')
			.then(players => this.setState({playersDict: players.data}));

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const players = urlParams.get('players');

		if (players) {
			this.setState({players: players.split(',')});
		}
	}

	onPlayerChange(e, item) {
		const {players} = this.state;
		const history = window.history;

		if (!item) {
			return;
		}

		this.setState({selectedPlayer: item}, () => {
			const newPlayers = [...players, item];

			this.setState({players: newPlayers, selectedPlayer: ''});

			history.pushState('', '', `?players=${newPlayers.join(',')}`);
		});
	}

	onPlayerClose(name) {
		const {players} = this.state;
		const history = window.history;
		const newPlayers = players.filter(player => player !== name);

		this.setState({players: newPlayers});

		if (newPlayers.length) {
			history.pushState('', '', `?players=${newPlayers.join(',')}`);
		} else {
			history.pushState('', '', '/ranks');
		}
	}

	renderPlayers() {
		const {players} = this.state;

		return players.map((player) => {
			return (
				<PlayerCard
					key={player}
					id={player}
					onClose={this.onPlayerClose}
				/>
			);
		});
	}

	render() {
		const {selectedPlayer, playersDict} = this.state;

		return (
			<div>
				<h1 style={{textAlign: 'left', marginLeft: '5px'}}>Guildies</h1>
				<div style={{width: '600px', display: 'flex', alignItems: 'center'}}>
					<Autocomplete
						onChange={this.onPlayerChange}
						options={playersDict.map(player => player.name)}
						value={selectedPlayer}
						freeSolo
						getOptionLabel={option => option}
						style={{width: 300, margin: '5px'}}
						renderInput={params => (
							<TextField {...params} label="Add player" variant="outlined" fullWidth />
						)}
					/>
					<div style={{
						fontSize: '12px',
						opacity: '.5',
						textAlign: 'left',
						marginLeft: '10px',
						width: '300px'
					}}>You can choose player from the suggest or get anyone from the server by pushing Enter</div>
				</div>
				<div>
					<div style={{display: 'flex', flexWrap: 'wrap'}}>{this.renderPlayers()}</div>
				</div>
			</div>
		);
	}
}

export default Ranks
