/* eslint-disable no-unused-vars */
const axios = require('axios');


const client_id = '779741162465525790';
const client_secret = process.env.client_secret;
const scope = 'identify';
const redirect_uri = 'https://bot.nuggetdev.com/login/confirm';
const discord_token_url = 'https://discord.com/api/oauth2/token';
const discord_api_url = 'https://discordapp.com/api';
module.exports = {
	/**
	 *
	 * @param {string} code The code we get from discord.
	 */
	async GetToken(code) {
		try {
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
				const res = JSON.parse(response.data);
				access_token = res.access_token;
			});
			return access_token;
		}
		catch (error) {
			console.log(error);
		}
	},
	/**
	 *
	 * @param {string} access_token The token we get from the GetToken function.
	 */
	async GetUserInfo(access_token) {
		try {
			let name;
			let id;
			let dash;
			let avatar;
			const url = discord_api_url + '/users/@me';
			axios({
				method: 'get',
				url: url,
				headers: { 'Authorization': `Bearer ${access_token}` },
			}).then(function(response) {
				const userJson = JSON.parse(response.data);
				name = userJson.id;
				id = userJson.username;
				dash = userJson.discriminator;
				avatar = userJson.avatar;
			});
			return { 'id': id, 'name': name, 'dash': dash, 'avatar': avatar };
		}
		catch (error) {
			console.log(error);
		}
	},
};
