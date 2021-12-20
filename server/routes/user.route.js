const router = require('express').Router();
const user = require('../controllers/user.controller');

router.get('/getOneUser/:id', user.getOneUser);
router.post('/addOneUser', user.addOneUser);
router.put('/updateUsersContacts/:id', user.updateUsersContacts);

module.exports = router;