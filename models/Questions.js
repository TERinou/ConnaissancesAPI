const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
	content: {
		type: String,
		required: [true, "Question content is required"]
	}
});

module.exports = mongoose.model('Questions', QuestionsSchema);