const crypto = require('crypto');

const { sessions } = require('./models');

module.exports = {
  createSession: async (res, userId) => {
    const sid = crypto.randomBytes(16).toString('base64');
    const session = await sessions.create({ userId, sid });
    res.setCookie('sid', session.sid, {
      path: '/',
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  },
};
