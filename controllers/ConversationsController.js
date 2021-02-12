/**
 * Handle POST replies.
 * If the content is queried with an id it means user reply a previous question.
 * Else reply a question to ask the user.
 * @param req
 * @param res
 */
exports.onPostReplies = function (req, res) {

	let content = req.body.content;
	let id = req.body.id;

	// --- If content is null || undefined, return Bad Request
	if (content === null || content === undefined) {
		return res.status(400).json({
			ok: false,
			code: 'CO40001',
			message: 'No reply found'
		});
	}

	// --- If id is null || undefined, reply user's question
	if (id === null || id === undefined) {
		return res.status(200).json({
			ok: true,
			reply: "BOT_REPLY"
		})
	}

	// --- Else
	// TODO Process the user response linked to the question this id
	return res.status(200).json({
		ok: true,
		reply: "BOT_REPLY"
	})
}