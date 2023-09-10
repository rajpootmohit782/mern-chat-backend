const {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfToGroup,
} = require('../controllers.js/chatControllers.js');

const router = require('express').Router();

router.route('/m').post(accessChat);
router.route('/fetch').get(fetchChats);
router.route('/group').post(createGroupChat);
router.route('/group').get(fetchGroups);
router.route('/group/exit').put(groupExit);
router.route('/group/add').put(addSelfToGroup);

module.exports = router;
