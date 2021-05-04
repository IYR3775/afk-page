/* eslint-disable no-unused-vars */
const axios = require('axios');
const fetch = require('node-fetch');
const session = require('express-session');
const { url } = require('inspector');
const { URLSearchParams } = require('url');

const client_id = '779741162465525790';
const client_secret = process.env.client_secret;
const scope = 'identify';
const redirect_uri = 'http://127.0.0.1:3000/login/confirm';
const discord_token_url = 'https://discord.com/api/oauth2/token';
const discord_api_url = 'https://discordapp.com/api/users/@me';

module.exports = {
	/**
	 *
	 * @param {string} code The code you get from Discord.
	 * @param {string} req The request data you get from Express.
	 * @returns {object} The information of the user.
	 */
	async registerUser(code, req) {
		const params = new URLSearchParams();
		params.append('client_id', client_id);
		params.append('client_secret', client_secret);
		params.append('grant_type', 'authorization_code');
		params.append('code', code);
		params.append('redirect_uri', redirect_uri);
		params.append('scope', scope);
		fetch(discord_token_url, {
			method: 'post',
			body: params,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}).then(response => response.json()).then(json => {
			const access_token = json['access_token'];
			axios({
				method: 'get',
				url: discord_api_url,
				headers: { 'Authorization': `Bearer ${access_token}` },
			}).then(function(response) {
				const userJson = response.data;
				req.session.uid = userJson.id;
				req.session.name = userJson.username;
				req.session.dash = userJson.discriminator;
				req.session.avatar = userJson.avatar;
				req.session.save(function(err) {
					if(err) {
						console.log(`There was an error saving the session.\nerr:\n${err}`);
					}
					else {
						console.log('Session saved.');
					}
				});
				return { 'id': req.session.uid, 'name': req.session.name, 'dash': req.session.dash, 'avatar': req.session.avatar };
			});
		}).catch(err => console.log(err));
	},
};