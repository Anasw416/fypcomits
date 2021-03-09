const router = require('express').Router();
const groupsRouter = require('./groups');

router.use(groupsRouter);

module.exports = router;
