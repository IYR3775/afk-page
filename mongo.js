const afkschema = require('./models/afkSchema');
const mongoose = require('mongoose');
const { GooseCache } = require('goosecache');
const cachegoose = new GooseCache(mongoose, {
	engine: 'memory',
});
mongoose.set('useFindAndModify', false);
module.exports = {

	/**
	 *
	 * @param {string} id Discord id
	 * @returns {number} The amount of points the user has.
	 *
	 */
	async addPoints(id) {
		if (!id) {
			return 'No Id is given. are you logged in?';
		}
		const pointsdata = await afkschema.findOne({ id: id }).cache(120);
		let points;
		if (pointsdata) {
			pointsdata.points + 1;
			pointsdata.save();
			points = pointsdata.points + 1;
		}
		if (!pointsdata) {
			const NewData = new afkschema({
				id: id,
				points: 1,
			});
			NewData.save();
			points = NewData.points;
		}
		cachegoose.clearCache();
		console.log(points);
		return points;
	},
};