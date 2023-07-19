const { readSid } = require('../utils');
const { sessions, users } = require('../models');

module.exports = async (req) => {
  const error = new Error('Unauthorized');
  const sid = readSid(req);
  if (!sid) throw error;

  const session = await sessions.findOne({ where: { sid }, include: [{ model: users }] });
  if (!session.user) throw error;

  req.sid = sid;
  req.user = session.user;
};
