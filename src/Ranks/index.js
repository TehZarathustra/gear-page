import React, {Component} from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
// import Loader from '../components/Loader';
import PlayerCard from '../components/PlayerCard';
// import ItemTemplate from '../components/ItemTemplate';
// import RankingsCard from '../components/RankingsCard';
// import classMapper from '../utils/class-mapper';
// import './styles.css';

class Ranks extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedPlayer: '',
			players: []
		};

		this.onPlayerChange = this.onPlayerChange.bind(this);
		// this.onPlayerAdd = this.onPlayerAdd.bind(this);
		this.onPlayerClose = this.onPlayerClose.bind(this);
	}

	onPlayerChange(e, item) {
		const {players} = this.state;

		if (!item) {
			return;
		}

		this.setState({selectedPlayer: item}, () => {
			this.setState({players: [...players, item], selectedPlayer: ''});
		});
	}

	// onPlayerAdd() {
	// 	const {players, selectedPlayer} = this.state;

	// 	this.setState({players: [...players, selectedPlayer], selectedPlayer: ''});
	// }

	onPlayerClose(name) {
		const {players} = this.state;

		this.setState({players: players.filter(player => player !== name)});
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
		const {selectedPlayer} = this.state;

		return (
			<div>
				<div style={{width: '300px'}}>
					<Autocomplete
						onChange={this.onPlayerChange}
						options={['Apparatchik', 'pek']}
						value={selectedPlayer}
						freeSolo
						getOptionLabel={option => option}
						style={{width: 300, margin: '5px'}}
						renderInput={params => (
							<TextField {...params} label="Add player" variant="outlined" fullWidth />
						)}
					/>
				</div>
				<div>
					<div style={{display: 'flex', flexWrap: 'wrap'}}>{this.renderPlayers()}</div>
				</div>
			</div>
		);
	}
}

export default Ranks
