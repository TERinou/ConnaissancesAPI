const router = require('express').Router();
const ConversationCtrl = require('../../controllers/ConversationsController');

router.route('/replies')
	.post(ConversationCtrl.onPostReplies);

router.route('/question')
	.get(ConversationCtrl.onGetQuestion);

module.exports = router;