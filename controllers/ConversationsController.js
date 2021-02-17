const brain = require('@terinou/brain');
const Questions = require('../models/Questions');

/**
 * Handle POST replies.
 * If the content is queried with an id it means user reply a previous question.
 * Else reply a question to ask the user.
 * @param req
 * @param res
 */
exports.onPostReplies = function (req, res) {

	const { id, content } = req.body;

	// --- If content is null || undefined, return Bad Request
	if (!content) {
		return res.status(400).json({
			ok: false,
			code: 'CO40001',
			message: 'User reply undefined'
		});
	}

	// --- If id is null || undefined, reply user's question
	if (!id) {
		return res.status(200).json({
			ok: true,
			reply: "BOT_REPLY"
		})
	}

	// --- Else
	// TODO Process the user response linked to the question id
	// like: (brain.treatReply())


	// TODO Get a new reply to send
	// like: (brain.getReply())
	const keywords = brain.getKeyWord(content);
	const reply = `Tu as raison c'est délicieux en ${keywords} ! Mais je préfère la brandade de morue :wink:`

	return res.status(200).json({
		ok: true,
		reply: reply,
	})
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
