const bookMutations = require('./book');
const userMutations = require('./user');

const Mutation = {
  ...userMutations,
  ...bookMutations,
};

module.exports = Mutation;
