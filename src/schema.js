const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    books(cursor: Int, take: Int): BooksWithCursors
    book(id: Int!): Book!
    findBooks(title: String, author: String): [Book]
  }
  type Mutation {
    addBook(input: addBookInput!): Book!
    editBook(input: editBookInput!): BookDetail!
    deleteBook(input: deleteBookInput!): Int!
    register(input: registerInput!): User!
    login(input: loginInput!): Tokens!
    refreshToken: Tokens!
    logout: LogoutResult!
  }

  input addBookInput {
    title: String!
  }

  input deleteBookInput {
    id: Int!
  }

  input editBookInput {
    id: Int!
    author: String
    published: Int
    genres: String
    rating: Int
  }

  input loginInput {
    email: String
    password: String!
  }

  input registerInput {
    email: String!
    password: String!
  }

  type User {
    id: Int!
    email: String!
    password: String!
  }

  type BooksWithCursors {
    books: [Book]
    cursor: Int
  }

  type Book {
    id: Int!
    title: String!
    book_detail: [BookDetail]
  }

  type BookDetail {
    id: Int!
    version: Int!
    author: String
    published: Int
    genres: String
    rating: Int
    book: Book
  }

  type LogoutResult {
    msg: String
  }

  type Tokens {
    accessToken: String
    refreshToken: String
  }
`;

module.exports = typeDefs;
