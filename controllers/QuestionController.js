/**
 * Answers the user's question
 * @param req
 * @param res
 */
exports.answerQuestion = function (req, res) {

	let content = req.query.content;

	if (content === undefined) {
		return res.status(400).json({
			ok: false,
			code: 'ME40001',
			message: 'No question were asked'
		});
	}

	return res.status(200).json({
		ok: true,
		answer: "La brandade de morue est la meilleur chose au monde...oups je crois que c'était pas ça la question!"
	})
}