// --- Module import
const Brain = require('@terinou/brain');
const Questions = require('../models/Questions');
const Words = require('../models/Words');
const DumpRelations = require('../models/DumpRelations');

// --- Global function
const {to} = require("../lib/to");


// --- Global variable
const INFERENCE_MAX_DEPTH = 5;


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


/**
 * Handle POST replies.
 * If the content is queried with an id it means user reply a previous question.
 * Else reply a question to ask the user.
 * @param req
 * @param res
 */
exports.onPostReplies = async function (req, res) {

	const {id, content} = req.body;

	// --- content is null || undefined, return Bad Request.
	if (!content) {
		return res.status(400).json({
			ok: false,
			code: 'CO40001',
			message: 'User reply undefined'
		});
	}

	// --- id is null || undefined, reply user's question.
	if (!id) {

		// --- Get content relation
		const relation = await Brain.getRelation(content);

		try {
			// --- Try to found the relation
			const inferences = await foundRelation(relation);

			// --- No relation found
			if (!inferences) {
				return res.status(404).json({
					ok: false,
					code: 'CO40403',
					message: 'Cannot find the relation',
					information: relation
				});
			}

			// --- We found something
			else {
				return res.status(200).json({
					ok: true,
					relation,
					inferences: (inferences.length > 1) ? inferences : undefined  // inferences length == 0 means we instantly found the relation, so it doesn't need to be return
				});
			}
		} catch (err) {
			console.error(err);
			return res.status(500).send(err.message);
		}
	}

	// --- Otherwise confirm we get his response.
	else {
		return res.status(200).json({ok: true});
	}
}


/**
 * Check if we found the relation related word in inferences and return it.
 * If not we return the list of useful inference we found. (inference with r_isa and relation.type relation).
 * Return null if the word from the relation doesn't exist
 * @param relation	The main relation to check
 * @returns {Promise<null|[]|*>}
 */
async function checkInferences(relation) {

	let inferences = [];

	// --- Find the word in the database.
	const [err, word] = await to(Words.findOne({word: relation.word}).exec());

	// --- If an error occurred.
	if (err) {
		console.error(err);
		return {ok: false, err: err};
	}

	// --- No word found.
	if (!word) {
		console.error(`[-]No word found for ${relation.word}`);
		return {ok: false};
	}

	// --- Get all inferences in our word relations (r_isa and the relation type we looking for).
	for (let wordRelation of word.relations) {
		if (wordRelation.type === DumpRelations.r_isa || wordRelation.type === relation.type) {

			// --- We found the related word.
			if (relation.relatedTo === wordRelation.word && relation.type === wordRelation.type) {
				return {
					ok: true,
					relation: {
						word: relation.word,
						type: wordRelation.type,
						relatedTo: wordRelation.word
					}
				};
			}

			// --- add a new inference
			inferences.push({word: relation.word, relation: wordRelation.type, relatedTo: wordRelation.word});
		}
	}

	return {ok: true, inferences: inferences};
}


/**
 * Try to found the requested relation by checking inferences.
 * Return the path if the relation has been found, else return null
 * @param relation 	The main relation to find
 * @param depth		The depth of search
 * @param path		The path we take during the travel
 * @returns {Promise<null|*[]>}
 */
async function foundRelation(relation, depth = 0, path = []) {

	// --- If too deep we stop, else we are on a new depth.
	if (depth >= INFERENCE_MAX_DEPTH) {
		return null;
	} else {
		depth++;
	}

	// --- Check inferences if we found the relation.
	// If not, we get the new inferences to work with.
	const res = await checkInferences(relation);

	// --- If something happened.
	if (!res.ok) {
		return null;
	}

	// --- If related word has been found.
	if (res.relation) {
		path.push(res.relation);
		return path;
	}

	// --- Else loop on the new inferences (if there is).
	if (res.inferences && res.inferences.length > 0) {
		for (let inference of res.inferences) {

			// --- Add the inference to the path.
			path.push(inference);

			// --- The new relation only change the word to check, the type and the related word doesn't change.
			const newRelation = Object.assign({}, relation, {word: inference.relatedTo});

			// --- If relation is found, then return the path we take.
			// Else we remove the last inference from the path.
			if (await foundRelation(newRelation, depth, path)) {
				return path;
			} else {
				path.pop();
			}
		}
	}

	return null;
}

