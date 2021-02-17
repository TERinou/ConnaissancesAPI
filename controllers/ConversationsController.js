const brain = require('@terinou/brain');
const Questions = require('../models/Questions');
const Words = require('../models/Words');

/**
 * Handle POST replies.
 * If the content is queried with an id it means user reply a previous question.
 * Else reply a question to ask the user.
 * @param req
 * @param res
 */
exports.onPostReplies = function (req, res) {

	const { id, content } = req.body;

	// content is null || undefined, return Bad Request.
	if (!content) {
		return res.status(400).json({
			ok: false,
			code: 'CO40001',
			message: 'User reply undefined'
		});
	}

	// get the main keyword of the phrase
	const keyword = brain.getKeyWord(content);
	if (!keyword) {
		return res.status(404).json({
			ok: false,
			code: 'CO40403',
			message: 'No keyword found'
		});
	}

	// id is null || undefined, reply user's question.
	if (!id) {
		Words.findOne({ word: keyword }, function (err, word) {
			if (err) { console.error(err); return res.status(500).send(err) }
			if (!word) {
				return res.status(404).json({
					ok: false,
					code: 'CO40402',
					message: 'No word found'
				});
			}
			return res.status(200).json({
				ok: true,
				word
			})
		})
	}

	// otherwise confirm we get his response. 
	else {
		return res.status(200).json({
			ok: true
		})
	}
}


/**
 * Handle GET question.
 * Search a question to ask the user, and send it to him.
 * @param req
 * @param res
 */
exports.onGetQuestion = function (req, res) {
	Questions.find({}, function (err, questions) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (!questions || questions.length === 0) {
			return res.status(404).json({
				ok: false,
				code: 'CO40401',
				message: 'No question found'
			});
		}

		const randomQuestion = questions[Object.keys(questions)[Math.floor(Math.random() * Object.keys(questions).length)]];

		return res.status(200).json({
			ok: true,
			question: randomQuestion
		});
	});
}
