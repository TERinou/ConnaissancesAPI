const router = require('express').Router();
const QuestionCtrl = require('../../controllers/QuestionController')

router.route('/getAnswer')
	.get(QuestionCtrl.answerQuestion);

module.exports = router;