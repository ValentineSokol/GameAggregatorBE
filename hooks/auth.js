const { readSid } = require('../utils');
const { sessions, users } = require('../models');

module.exports = async (req, res) => {
  const sid = readSid(req);
  if (!sid) res.code(403).send({ isLoggedIn: false });

  const session = await sessions.findOne({
    where: { sid },
    include: [{
      model: users,
      attributes: { exclude: ['password'] },
    }],
  });
  if (!session.user) res.code(403).send({ isLoggedIn: false });

  req.sid = sid;
  req.user = session.user;
};
