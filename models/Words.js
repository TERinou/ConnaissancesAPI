const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
	word: {
		type: String,
		unique: true,
		required: [true, "A word is required"]
	},
	relations: [
		{
			type: String
		}
	]
});

module.exports = mongoose.model('Words', QuestionsSchema);