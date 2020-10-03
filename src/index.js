require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const { validateAccessToken } = require('./utils');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res, req }) => {
    const header = req.headers.authorization;
    let user;

    if (header) {
      const token = header.replace('Bearer ', '');
      const decoded = validateAccessToken(token);
      user = decoded;
    }

    return {
      res,
      req,
      prisma,
      user,
    };
  },
  introspection: true,
  playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 app running at ${url}`);
});
