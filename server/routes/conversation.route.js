const router = require('express').Router();
const conversation = require('../controllers/conversation.controller');

router.get('/getAllConversatios', conversation.getAllConversatios);
router.get('/getConversationsByUserId/:userId', conversation.getConversationsByUserId);
router.get('/getConversationsByRoomId/:roomId', conversation.getConversationsByRoomId);
router.post('/addOneConversation', conversation.addOneConversation);
router.put('/updateConversationDetails/:roomId', conversation.updateConversationDetails);
router.delete('/deleteConversationById/:id', conversation.deleteConversationById);

module.exports = router;