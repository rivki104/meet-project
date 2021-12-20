const router = require('express').Router();
const contact = require('../controllers/contact.controller');

router.post('/addOneContact', contact.addOneContact);
router.get('/passUserToken/:token', contact.passUserToken);
router.get('/getAdditionalContacts/:userId', contact.getAdditionalContacts);

module.exports = router; 