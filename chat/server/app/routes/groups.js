const router = require('express').Router();
const db = require('../../../../library/sequelize-cli/models/index');


const Groups = db.groups;
const Message = db.messages;
const User = db.user_details;
const Operator = db.Sequelize.Op;
const teamInfo = db.team_informations;
// GET request to get all groups
router.get('/:teamId', (req, res, next) => {
  Groups.findAll(
      {
        where: {
          team_id: req.params.teamId
        },
        include: [
          { model: teamInfo, attributes: ['team_logo'],
            where: {
              team_id: req.params.teamId
            }
          },
        ],
      }
  )
  .then((foundGroups) => {
    res.send(foundGroups);
  })
  .catch(next);
});

// Get new messages from group since user logged in
router.get('/messages/new', (req, res, next) => {
  if (!req.body.userScopeId) { res.send(404) }
  Message.findAll({
    where: {
      // createdAt: {
      //   $gt: req.user.updatedAt,
      // },
      group_id: 1
    },
    include: [
      { model: User, attributes: ['user_name', 'profile_picture'] },
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
  })
  .then((foundMessages) => {
    res.send(foundMessages);
  })
  .catch(next);
});

// GET request to get all messages of a group
router.get('/:groupId/messages', (req, res, next) => {
  Message.findAll({
    where: {
      group_id: req.params.groupId,
    },
    include: [
      { model: User, attributes: ['user_name', 'profile_picture'] },
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
  })
  .then((foundMessages) => {
    res.send(foundMessages);
  })
  .catch(next);
});

// POST request to add a message
router.post('/:groupId/messages', (req, res, next) => {
  User.findByPk(req.body.userScopeId)
  .then((foundUser) => {
    return Message.create(req.body)
      .then((createdMessage) => {
        const createdMessageInJSON = createdMessage.toJSON();
        createdMessageInJSON.user = foundUser;
        return createdMessageInJSON;
      });
  })
  .then((completeMessage) => {
    res.send(completeMessage);
  })
  .catch(next);
});

module.exports = router;
