const crypto = require('crypto');

const { sessions } = require('./models');

module.exports = {
  createSession: async (res, userId) => {
    const sid = crypto.randomBytes(64).toString('hex');
    const session = await sessions.create({ userId, sid });
    res.setCookie('sid', session.sid, {
      path: '/',
      signed: false, // temporarily disable because don't have time to fix the error when unsigning.
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  },
  readSid: (req) => req.cookies.sid, // req.unsignCookie(req.cookies.sid) Read comment above,
};
