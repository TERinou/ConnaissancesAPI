const router = require('express').Router();
const ConversationCtrl = require('../../controllers/ConversationsController')

router.route('/replies')
	.post(ConversationCtrl.onPostReplies);

module.exports = router;