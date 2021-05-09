/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const login = require('./login');
const mongo = require('./mongo');

const discord_login_url = 'https://discord.com/api/oauth2/authorize?client_id=779741162465525790&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Flogin%2Fconfirm&response_type=code&scope=identify';

mongoose.connect(process.env.mongouri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Connected to mongoDB!');
}).catch((err) => {
	console.log('Unable to connect to mongoDB. Error:' + err);
});

const app = express();
app.set('json spaces', 1);
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(session({
	secret: process.env.appSecret,
	resave: true,
	saveUninitialized: true,
}));

app.get('/arc-sw.js', function(req, res) {
	res.sendFile('/arc-sw.js', { root: __dirname });
});

app.get('/login/confirm', async function(req, res) {
	const code = req.query.code;
	if (code) {
		await login.registerUser(code, req, res);
	}
	else if (!code) {
		res.status(401);
		res.send('gtfo out of here boi');
	}
});

app.get('/login', function(req, res) {
	res.redirect(discord_login_url);
});

app.get('/', function(req, res) {
	if (!req.session.uid) return res.redirect(discord_login_url);
	res.render('index');
});

app.get('/gibcoins', async function(req, res) {
	if(!req.session.uid) return res.redirect(discord_login_url);
	res.status(200);
	const points = await mongo.addPoints(req.session.uid);
	console.log(points);
	res.send(points);
});

app.listen(process.env.port);
console.log(`Server is now ready on port: ${process.env.baseUrl}`);