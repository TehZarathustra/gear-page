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
      loading: true
    }

    this.onItemChange = this.onItemChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
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
      selectedPlayer: ''
    });
  }

  onPlayerChange(e, player) {
    this.setState({
      selectedItem: '',
      selectedPlayer: player
    });
  }

  render () {
    const {data, selectedItem, selectedPlayer, loading} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {!loading && (<div style={{marginTop: '50px', fontSize: '34px'}}>Abandoned - Gear Wishlist: Molten Core</div>)}
          {!loading && (<div style={{
            display: 'flex',
            background: 'white',
            margin: '50px 0 10px 10px',
            padding: '20px',
            borderRadius: '5px'
          }}>
            <Autocomplete
              onChange={this.onItemChange}
              options={Object.keys(data)}
              value={selectedItem}
              getOptionLabel={option => option}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField {...params} label="Sort by item" variant="outlined" fullWidth />
              )}
            />

            <Autocomplete
              onChange={this.onPlayerChange}
              options={this.transformDataToPlayers(data)}
              value={selectedPlayer}
              getOptionLabel={option => option}
              style={{ width: 300, marginLeft: '20px', color: 'white !important' }}
              renderInput={params => (
                <TextField {...params} label="Sort by player" variant="outlined" fullWidth />
              )}
            />
          </div>)}
          {loading && (<CircularProgress />)}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {!selectedItem && !selectedPlayer && Object.keys(data).map((key) => {
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
          </div>
        </header>
      </div>
    );
  }
}

export default App;
