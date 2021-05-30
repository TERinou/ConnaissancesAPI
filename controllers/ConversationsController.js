const Brain = require('@terinou/brain');
const Questions = require('../models/Questions');
const Words = require('../models/Words');
const DumpRelations = require('../models/DumpRelations');
const { to } = require("../lib/to");

/**
 * Define the maximum depth to check while searching in inferences
 */
const INFERENCE_MAX_DEPTH = 3;

/**
 * The oneshot types or the DumpRelation that needed to be checked alone and only on 1st depth.
 */
const oneshotTypes = [DumpRelations.r_own, DumpRelations.r_color]


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

	const { id, content } = req.body;

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
		const relation = Brain.getRelation(content);

		try {
			const oneshot = oneshotTypes.includes(relation.type);
			const inferences = await foundRelation(relation, oneshot);

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
		return res.status(200).json({ ok: true });
	}
}

/**
 * Check if we found the relation related word in inferences and return it.
 * If not we return the list of useful inference we found. (inference with r_isa and relation.type relation).
 * Return null if the word from the relation doesn't exist
 * @param relation The main relation to check
 * @param oneshot  Boolean to toggle oneshot mode
 * @returns {Promise<null|[]|*>} Null if no word found, else the word and the inferences found to get it.
 */
async function checkInferences(relation, oneshot) {

	let inferences = [];

	// --- Find the word in the database.
	const [err, word] = await to(Words.findOne({ word: relation.word }).exec());

	// --- error occured or no word found.
	if (err || !word) {
		console.error(err);
		return { ok: false, err: err };
	}

	// --- only check if we found the specific relation type in the inference.
	if (oneshot) {
		for (const wordRelation of word.relations) {
			if (relation.relatedTo === wordRelation.word && relation.type === wordRelation.type) {
				return {
					ok: true,
					relation: {
						word: relation.word,
						type: wordRelation.type,
						relatedTo: wordRelation.word
					}
				}
			}
		}
	}

	// --- check if we found the specific relation type and r_isa in the inference.
	else {
		for (const wordRelation of word.relations) {
			if (wordRelation.type === DumpRelations.r_isa || wordRelation.type === relation.type) {
				const newRelation = {
					word: relation.word,
					type: wordRelation.type,
					relatedTo: wordRelation.word
				};

				// if we found the related word, else save the inference.
				if (relation.relatedTo === wordRelation.word && relation.type === wordRelation.type)
					return { ok: true, relation: newRelation };

				inferences.push(newRelation);
			}
		}
	}

	return { ok: true, inferences };
}

/**
 * Try to found the requested relation by checking inferences.
 * Return the path if the relation has been found, else return null
 * @param relation 	The main relation to find
 * @param depth		The depth of search
 * @param path		The path we take during the travel
 * @returns {Promise<null|*[]>}
 */
async function foundRelation(relation, oneshot, depth = 0, path = []) {

	// --- If too deep we stop, else we are on a new depth.
	if (depth >= INFERENCE_MAX_DEPTH) return null;
	else depth++;

	const res = await checkInferences(relation, oneshot);
	if (res.err) return null;

	// --- If related word has been found or oneshot mode.
	if (res.relation || oneshot) {
		if (res.relation) {
			path.push(res.relation);
			return path;
		}

		else return null;
	}

	// --- else loop on the new inferences found.
	if (res.inferences && res.inferences.length > 0) {
		for (let inference of res.inferences) {
			path.push(inference);

			// --- The new relation only change the word to check, the type and the related word doesn't change.
			const newRelation = Object.assign({}, relation, { word: inference.relatedTo });

			// --- If relation is found return the path, else remove the last inference.
			if (await foundRelation(newRelation, oneshot, depth, path)) return path;
			else path.pop();
		}
	}

	return null;
}

