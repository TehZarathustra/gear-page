const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;

const getWishlistData = require('./wishlist');
const {getRaidLog, getItemsByPlayer, getPlayerList, getPlayerRankings} = require('./raidLog');
const {getParses, getRankings} = require('../api/wclogs');

app.use(express.static(path.join(__dirname, '../build')));
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/player/:name', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/players', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/ranks', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/ranks/:zone/:player', function (req, res) {
	return getPlayerRankings(null, null, req, res);
});

app.get('/data', function (req, res) {
	return getWishlistData(req, res);
});

app.get('/player-list', function (req, res) {
	return getPlayerList(req, res);
});

app.get('/raid-log', function (req, res) {
	return getRaidLog(req, res);
});

app.get('/items/:player', function (req, res) {
	return getItemsByPlayer(req, res);
});

app.get('/raid-log/:player', function (req, res) {
	return getRaidLog(req, res);
});

app.get('/parses/:zone/:player', function (req, res) {
	return getParses(req, res);
});

app.get('/rankings/:zone/:metric/:player', function (req, res) {
	return getRankings(req, res);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
