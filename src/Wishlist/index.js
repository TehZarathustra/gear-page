import React, {Component} from 'react';
import axios from 'axios';
import Card from '../components/Card';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../components/Loader';

class Wishlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      dicts: {},
      selectedPlayer: '',
      selectedItem: '',
      selectedType: '',
      selectedBoss: '',
      loading: true,
      areFiltersHidden: false
    }

    this.onItemChange = this.onItemChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.getBossesByItems = this.getBossesByItems.bind(this);
    this.onBossChange = this.onBossChange.bind(this);
    this.renderFilteredCards = this.renderFilteredCards.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentDidMount() {
    const url = new URL(window.location.href);

    axios.get(`/data${url.search}`)
      .then((response) => {
        this.setState({
          data: response.data.data,
          loading: false,
          dicts: response.data.dicts,
          ...response.data.query
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  toggleFilters() {
    const {areFiltersHidden} = this.state;

    this.setState({areFiltersHidden: !areFiltersHidden});
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
    const history = window.history;
    const parameters = [];

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
      parameters.push(`selectedItem=${selectedItem}`);
      mutableData = mutableData.filter(({item}) => item === selectedItem);
    }

    if (selectedPlayer) {
      parameters.push(`selectedPlayer=${selectedPlayer}`);
      mutableData = mutableData.filter(item => item.all.includes(selectedPlayer));
    }

    if (selectedType) {
      parameters.push(`selectedType=${selectedType}`);
      mutableData = mutableData.filter(item => item.type === selectedType);
    }

    if (selectedBoss) {
      parameters.push(`selectedBoss=${selectedBoss}`);
      mutableData = mutableData.filter(item => item.bosses.includes(selectedBoss));
    }

    if (!mutableData.length) {
      return (<div>Nothing found</div>);
    };

    if (parameters.length) {
      history.pushState('', '', `?${parameters.join('&')}`);
    } else {
      history.pushState('', '', '/');
    }

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
      loading,
      areFiltersHidden
    } = this.state;

    return (
      <div>
        {!loading && (<div style={{
            position: 'relative',
            position: 'fixed',
            background: 'black',
            width: '100%',
            zIndex: '2',
          }}>
            <div style={{
              display: areFiltersHidden ? 'none' : 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '5px',
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
                options={['Blackwing Lair', 'Molten Core', 'AhnQiraj']}
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
            </div>
            <div className="hide-filters-button" onClick={this.toggleFilters}>
              {areFiltersHidden ? 'Show filters' : 'Hide filters'}
            </div>
          </div>)}
        <header className="App-header">
          {!loading 
            && !selectedPlayer
            && !selectedItem
            && (<div className="main-title">
              {selectedType ? `Abandoned - Gear Wishlist (${selectedType})` : `Abandoned - Gear Wishlist`}
            </div>)
          }
          {loading && (<Loader />)}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {!loading && this.renderFilteredCards()}
          </div>
        </header>
      </div>
    );
  }
}

export default Wishlist;
