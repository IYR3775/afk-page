/* eslint-disable no-unused-vars */
const axios = require('axios');


const client_id = '779741162465525790';
const client_secret = process.env.client_secret;
const scope = 'identify';
const redirect_uri = 'https://bot.nuggetdev.com/login/confirm';
const discord_login_url = 'https://discord.com/api/oauth2/authorize?client_id=779741162465525790&redirect_uri=https%3A%2F%2Fafk.nuggetdev.com%2Flogin%2Fconfrim&response_type=code&scope=identify';
const discord_token_url = 'https://discord.com/api/oauth2/token';
const discord_api_url = 'https://discordapp.com/api';
module.exports = {
	async GetToken(code) {
		let access_token;
		const payload = {
			'client_id': client_id,
			'client_secret': client_secret,
			'grant_type': 'authorization_code',
			'code': code,
			'redirect_uri': redirect_uri,
			'scope': scope,
		};
		axios({
			method: 'post',
			url: discord_token_url,
			data: payload,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}).then(function(response) {
			const res = JSON.parse(response);
			access_token = res.access_token;
		});
		return access_token;
	},
	async GetUserInfo(access_token) {
		let name;
		let id;
		let dash;
		let avatar;
		const url = discord_api_url + '/users/@me';
		axios({
			method: 'get',
			url: url,
			headers: `Authorization": Bearer ${access_token}`,
		}).then(function(response) {
			const userJson = JSON.parse(response);
			name = userJson.id;
			id = userJson.username;
			dash = userJson.discriminator;
			avatar = userJson.avatar;
		});
		return { 'id': id, 'name': name, 'dash': dash, 'avatar': avatar };
	},
};
