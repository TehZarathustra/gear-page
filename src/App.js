import React, {Component} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Card from './components/Card';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      dicts: {},
      selectedPlayer: '',
      selectedItem: '',
      selectedType: '',
      selectedBoss: '',
      loading: true
    }

    this.onItemChange = this.onItemChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.getBossesByItems = this.getBossesByItems.bind(this);
    this.onBossChange = this.onBossChange.bind(this);
    this.renderFilteredCards = this.renderFilteredCards.bind(this);
  }

  componentDidMount() {
    axios.get('/data')
      .then((response) => {
        console.log('response >', response);
        this.setState({
          data: response.data.data,
          loading: false,
          dicts: response.data.dicts
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getBossesByItems() {
    const {dicts} = this.state;

    if (!dicts.items) {
      return [];
    }

    return Object.values(Object.values(dicts.items).reduce((result, item) => {
      const {bosses} = item;

      if (bosses) {
        bosses.forEach((boss) => result[boss] = boss);
      }

      return result;
    }, {}));
  }

  transformDataToPlayers(data) {
    return Object.keys(Object.values(data).reduce((result, item) => {
      item.all.forEach((p) => {
        if (/\s/.test(p)) {
          return;
        }

        result[p] = p;
      })

      return result;
    }, {})).sort();
  }

  onItemChange(e, item) {
    this.setState({
      selectedItem: item,
    });
  }

  onPlayerChange(e, player) {
    this.setState({
      selectedPlayer: player
    });
  }

  onTypeChange(e, type) {
    this.setState({
      selectedType: type,
    });
  }

  onBossChange(e, boss) {
    this.setState({
      selectedBoss: boss
    });
  }

  renderFilteredCards() {
    const {
      data,
      dicts,
      selectedItem,
      selectedPlayer,
      selectedType,
      selectedBoss
    } = this.state;

    let mutableData = Object.values({...data});

    if (selectedItem) {
      mutableData = mutableData.filter(({item}) => item === selectedItem);
    }

    if (selectedPlayer) {
      mutableData = mutableData.filter(item => item.all.includes(selectedPlayer));
    }

    if (selectedType) {
      mutableData = mutableData.filter(item => item.type === selectedType);
    }

    if (selectedBoss) {
      mutableData = mutableData.filter(item => item.bosses.includes(selectedBoss));
    }

    if (!mutableData.length) {
      return (<div>Nothing found</div>);
    };

    return mutableData.map((card) => {
      return (
        <Card
          key={card.item}
          data={card}
          itemName={card.item}
          dicts={dicts}
        />
      );
    });
  }

  render () {
    const {
      data,
      dicts,
      selectedItem,
      selectedPlayer,
      selectedType,
      selectedBoss,
      loading
    } = this.state;

    return (
      <div className="App">
        {!loading && (<div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'fixed',
            background: 'white',
            padding: '5px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Autocomplete
              onChange={this.onItemChange}
              options={Object.keys(data)}
              value={selectedItem}
              getOptionLabel={option => option}
              style={{width: 300, margin: '5px'}}
              renderInput={params => (
                <TextField {...params} label="Sort by item" variant="outlined" fullWidth />
              )}
            />

            <Autocomplete
              onChange={this.onPlayerChange}
              options={this.transformDataToPlayers(data)}
              value={selectedPlayer}
              getOptionLabel={option => option}
              style={{width: 300, margin: '5px'}}
              renderInput={params => (
                <TextField {...params} label="Sort by player" variant="outlined" fullWidth />
              )}
            />

            <Autocomplete
              onChange={this.onTypeChange}
              options={['Onyxia', 'Molten Core']}
              value={selectedType}
              getOptionLabel={option => option}
              style={{width: 300, margin: '5px'}}
              renderInput={params => (
                <TextField {...params} label="Sort by type" variant="outlined" fullWidth />
              )}
            />

            <Autocomplete
              onChange={this.onBossChange}
              options={this.getBossesByItems()}
              value={selectedBoss}
              getOptionLabel={option => option}
              style={{width: 300, margin: '5px'}}
              renderInput={params => (
                <TextField {...params} label="Sort by boss" variant="outlined" fullWidth />
              )}
            />
          </div>)}
        <header className="App-header">
          {!loading 
            && !selectedPlayer
            && !selectedItem
            && (<div style={{marginTop: '150px', marginBottom: '20px', fontSize: '34px'}}>
              {selectedType ? `Abandoned - Gear Wishlist (${selectedType})` : `Abandoned - Gear Wishlist`}
            </div>)
          }
          {loading && (<CircularProgress />)}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {!loading && this.renderFilteredCards()}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
