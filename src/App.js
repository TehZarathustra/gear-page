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
      selectedPlayer: '',
      selectedItem: '',
      selectedType: '',
      loading: true
    }

    this.onItemChange = this.onItemChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  componentDidMount() {
    axios.get('/data')
      .then((response) => {
        console.log('response >', response);
        this.setState({data: response.data.data, loading: false});
      })
      .catch(function (error) {
        console.log(error);
      });
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
      selectedPlayer: '',
      selectedType: ''
    });
  }

  onPlayerChange(e, player) {
    this.setState({
      selectedItem: '',
      selectedType: '',
      selectedPlayer: player
    });
  }

  onTypeChange(e, type) {
    this.setState({
      selectedItem: '',
      selectedType: type,
      selectedPlayer: ''
    });
  }

  render () {
    const {
      data,
      selectedItem,
      selectedPlayer,
      selectedType,
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
            {!selectedItem
              && !selectedPlayer
              && !selectedType
              && Object.keys(data).map((key) => {
              return (
                <Card
                  key={key}
                  data={data[key]}
                  itemName={key}
                />
              );
            })}
            {selectedItem && Object.keys(data).filter(data => data === selectedItem).map((key) => {
              return (
                <Card
                  key={key}
                  data={data[key]}
                  itemName={key}
                />
              );
            })}
            {selectedPlayer && Object.keys(data).filter(item => data[item].all.includes(selectedPlayer)).map((key) => {
              return (
                <Card
                  key={key}
                  data={data[key]}
                  itemName={key}
                />
              );
            })}
            {selectedType && Object.keys(data).filter(item => data[item].type === selectedType).map((key) => {
              return (
                <Card
                  key={key}
                  data={data[key]}
                  itemName={key}
                />
              );
            })}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
