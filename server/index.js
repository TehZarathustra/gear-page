const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const getWishlistData = require('./wishlist');
const getRaidLog = require('./raidLog');

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/kek', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/data', function (req, res) {
	return getWishlistData(req, res);
});

app.get('/raid-log', function (req, res) {
	return getRaidLog(req, res);
});

app.get('/raid-log/:player', function (req, res) {
	return getRaidLog(req, res);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
