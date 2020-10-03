const { GraphQLError } = require('graphql');
const { AuthenticationError } = require('apollo-server');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { parseCookies, validateRefreshToken } = require('../utils');

const userMutations = {
  refreshToken: async (_, __, ctx) => {
    const cookies = parseCookies(ctx.res);
    if (!cookies.refreshToken) {
      throw new AuthenticationError('No refresh token');
    }

    const token = validateRefreshToken(cookies.refreshToken);
    const user = await ctx.prisma.user.findOne({
      where: {
        id: token.id,
      },
    });
    if (user.refreshToken !== cookies.refreshToken) {
      throw new AuthenticationError('GTFO');
    }
    if (!user) throw new GraphQLError('User not found');
    const accessKey = fs.readFileSync(path.join(__dirname, '../keys/accesskey.pem'), 'utf8');
    const refreshKey = fs.readFileSync(path.join(__dirname, '../keys/refreshkey.pem'), 'utf8');
    const accessToken = jwt.sign({ email: user.email }, accessKey, { expiresIn: '1 minute' });
    const refreshToken = jwt.sign({ id: user.id }, refreshKey, { expiresIn: '7 days' });

    const options = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    };

    ctx.res.cookie('refreshToken', refreshToken, options);

    return {
      accessToken,
      refreshToken,
    };
  },
  logout: async (_, __, ctx) => {
    ctx.res.setHeader('set-cookie', 'refreshToken=; max-age=0');
    return {
      msg: 'ok',
    };
  },
  login: async (_, { input: { email, password } }, ctx) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new GraphQLError('User not found');
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new GraphQLError('Wrong login/password');
    }

    const accessKey = fs.readFileSync(path.join(__dirname, '../keys/accesskey.pem'), 'utf8');
    const refreshKey = fs.readFileSync(path.join(__dirname, '../keys/refreshkey.pem'), 'utf8');
    const accessToken = jwt.sign({ email }, accessKey, { expiresIn: '15 minutes' });
    const refreshToken = jwt.sign({ id: user.id }, refreshKey, { expiresIn: '7 days' });

    await ctx.prisma.user.update({
      data: {
        refreshToken,
      },
      where: {
        id: user.id,
      },
    });

    const options = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    };
    ctx.res.cookie('refreshToken', refreshToken, options);
    return {
      accessToken,
      refreshToken,
    };
  },
  register: async (_, { input: { email, password } }, ctx) => {
    if (password.length < 5) throw new AuthenticationError('Password too short - must be at least 6 characters');

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await ctx.prisma.user.create({
      data: {
        email,
        password: hashedPass,
      },
    });
    return user;
  },
};

module.exports = userMutations;
