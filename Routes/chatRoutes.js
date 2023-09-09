const {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
} = require('../controllers.js/chatControllers.js');

const router = require('express').Router();

router.route('/').post(accessChat);
router.route('/').get(fetchChats);
router.route('/group').post(createGroupChat);
router.route('/group').get(fetchGroups);
router.route('/group/exit').put(groupExit);

module.exports = router;
