const router = require('express').Router();
const record = require('../controllers/record.controller');

router.get('/getRecordById/:id', record.getRecordById);
router.get('/getRecordByUserAndConversation/:userId&:conversationId', record.getRecordByUserAndConversation);
router.post('/addOneRecord', record.addOneRecord);
router.put('/updateRecordDetails/:roomId', record.updateRecordDetails);
router.delete('/deleteRecordById/:id', record.deleteRecordById);

module.exports = router;