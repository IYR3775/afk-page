const afkschema = require('./models/afkSchema');
const mongoose = require('mongoose');
const { GooseCache } = require('goosecache');
const cachegoose = new GooseCache(mongoose, {
	engine: 'memory',
});
mongoose.set('useFindAndModify', false);
module.exports = {


	async addpoints(id) {
		afkschema.findOne({ id: id }, async (err, data) => {
			if(err) throw err;
			if(!data) {
				const NewData = new afkschema({
					id: id,
					points: 1,
				});
				NewData.save();
			}
			if(data) {
				data.points + 1;
				data.save();
			}
		});
		cachegoose.clearCache();
		return { id };
	},
};