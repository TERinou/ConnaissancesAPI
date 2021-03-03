const Brain = require('@terinou/brain');
const Questions = require('../models/Questions');
const Words = require('../models/Words');

const INFERENCES_MAX_DEPTH = 5;

/**
 * Handle POST replies.
 * If the content is queried with an id it means user reply a previous question.
 * Else reply a question to ask the user.
 * @param req
 * @param res
 */
exports.onPostReplies = async function (req, res) {

	const {id, content} = req.body;

	// content is null || undefined, return Bad Request.
	if (!content) {
		return res.status(400).json({
			ok: false,
			code: 'CO40001',
			message: 'User reply undefined'
		});
	}

	// TODO Stop using getKeyWord and get all information needed
	// get the main keyword of the phrase
	// const keyword = brain.getKeyWord(content);
	// if (!keyword) {
	// 	return res.status(404).json({
	// 		ok: false,
	// 		code: 'CO40403',
	// 		message: 'No keyword found'
	// 	});
	// }

	// Mocking example
	const information = {
		object: "carotte",
		relationType: "r_isa",
		relation: "aliment"
	}

	// id is null || undefined, reply user's question.
	if (!id) {
		let word = information.object;	// object copy for manipulation
		let inferences = []; 				// store each inference we found
		let depth = 0;		 				// actual depth

		while (depth < INFERENCES_MAX_DEPTH) {
			try {
				// Retrieve word data
				const wordData = await Words.findOne({word: word}).exec();

				// No word found
				if (!wordData) {
					return res.status(404).json({
						ok: false,
						code: 'CO40402',
						message: `No word found for ${word}`
					});
				}

				// Go through each relation
				for (let relation of wordData.relations) {
					if (relation.type === information.relationType) {
						if (relation.word === information.relation) {
							return res.status(200).json({ok: true, information, inferences});
						}
						word = relation.word;
						inferences.push(word);
						break;
					}
				}

				depth++;
			} catch (err) {
				console.error(err);
				return res.status(500).send(err.message);
			}
		}

		return res.status(404).json({
			ok: false,
			code: 'CO40404',
			message: 'Cannot find the relation',
			information,
			inferences
		})
	}

	// otherwise confirm we get his response.
	else {
		return res.status(200).json({ok: true});
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