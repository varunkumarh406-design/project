const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = 'testsecret';
const UserPath = require.resolve('../models/User');
const authControllerPath = require.resolve('../controllers/authController');

const resetRequireCache = () => {
  delete require.cache[UserPath];
  delete require.cache[authControllerPath];
};

test('loginUser accepts the built-in demo user even when no database user exists', async () => {
  resetRequireCache();

  const fakeUserModel = {
    findOne: async ({ email }) => {
      if (email === 'traderx@stocksocial.com') return null;
      return null;
    },
    create: async (payload) => ({
      _id: 'demo-user-id',
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar,
      virtualBalance: payload.virtualBalance || 100000,
      password: payload.password,
      matchPassword: async (enteredPassword) => enteredPassword === payload.password,
    }),
  };

  require.cache[UserPath] = { exports: fakeUserModel };
  const { loginUser } = require('../controllers/authController');

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  await loginUser({ body: { email: 'traderx@stocksocial.com', password: 'password123' } }, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.payload && res.payload.token, 'token should be present');
  assert.equal(res.payload.email, 'traderx@stocksocial.com');
});
