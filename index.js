require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const login = require('./login');
const discord_login_url = 'https://discord.com/api/oauth2/authorize?client_id=779741162465525790&redirect_uri=https%3A%2F%2Fafk.nuggetdev.com%2Flogin%2Fconfrim&response_type=code&scope=identify';

mongoose.connect(process.env.mongouri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Connected to mongoDB!');
}).catch((err) => {
	console.log('Unable to connect to mongoDB. Error:' + err);
});

app.set('json spaces', 1);
app.use('/public', express.static('public'));
app.use(bodyParser.json());

app.get('/arc-sw.js', function(req, res) {
	res.sendFile('/arc-sw.js', { root: './routes' });
});

app.get('/login/confirm', function(req, res) {
	const code = req.query.code;
	const accessCode = login.GetToken(code);
	const UserInfo = login.GetUserInfo(accessCode);
	console.log(UserInfo);
});

app.listen(3000);
console.log('Server is now ready on port: 3000');