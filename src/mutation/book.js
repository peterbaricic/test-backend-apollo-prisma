const { GraphQLError } = require('graphql');

const bookMutations = {
  addBook: async (_, { input: book }, ctx) => {
    if (!ctx.user) return new GraphQLError('Must be authenticated');
    const result = await ctx.prisma.book.create({
      data: book,
    });
    return result;
  },
  editBook: async (_, { input: data }, ctx) => {
    if (!ctx.user) return new GraphQLError('Must be authenticated');
    const book = await ctx.prisma.book.findOne({
      where: {
        id: data.id,
      },
    });
    if (!book) {
      throw new GraphQLError('book not found');
    }
    const latestVersion = await ctx.prisma.book_detail.findFirst({
      where: {
        book_id: book.id,
      },
      orderBy: [{ version: 'desc' }],
    });
    const version = latestVersion ? latestVersion.version + 1 : 1;
    const { id, ...newBookDetail } = data;
    const detail = await ctx.prisma.book_detail.create({
      select: {
        id: true,
        author: true,
        published: true,
        rating: true,
        genres: true,
        version: true,
      },
      data: {
        ...newBookDetail,
        version,
        book: {
          connect: { id: book.id },
        },
      },
    });
    return detail;
  },
  deleteBook: async (_, { id }, ctx) => {
    if (!ctx.user) return new GraphQLError('Must be authenticated');
    const del = await ctx.prisma.book.delete({
      where: {
        id,
      },
    });
    return del;
  },
};

module.exports = bookMutations;
