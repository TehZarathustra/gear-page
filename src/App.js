import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';
import Wishlist from './Wishlist';
import RaidLog from './RaidLog';
// import Players from './Players';
import Ranks from './Ranks';
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from "@material-ui/core";

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function App() {
return (
  <Router>
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Wishlist />
          </Route>
          <Route exact path="/player/:name" component={RaidLog} />
          {/*<Route exact path="/players" component={Players} />*/}
          <Route exact path="/ranks" component={Ranks} />
        </Switch>
      </div>
    </ThemeProvider>
  </Router>
);
}
