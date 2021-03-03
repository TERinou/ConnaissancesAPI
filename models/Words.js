const DumpRelations = require('./DumpRelations');
const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
	word: {
		type: String,
		unique: true,
		required: [true, "A word is required"]
	},
	relations: [
		{
			word: {
				type: String,
				required: [true, "A word is required"]
			},
			type: {
				type: String,
				enum: DumpRelations,
				required: [true, "A relation type is required"]
			}
		}
	]
});

module.exports = mongoose.model('Words', WordSchema);