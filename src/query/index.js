const Query = {
  books: async (_, { cursor, take }, ctx) => {
    const books = await ctx.prisma.book.findMany({
      take: take ?? 5,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      include: {
        book_detail: true,
      },
    });
    return {
      books,
      cursor: books.length > 1 ? books[books.length - 1].id : null,
    };
  },
  book: async (_, { id }, ctx) => {
    const book = await ctx.prisma.book.findOne({ where: { id }, include: { book_detail: true } });
    return book;
  },
  findBooks: async (_, { title, author }, ctx) => {
    const book = await ctx.prisma.book.findMany({
      include: {
        book_detail: true,
      },
      where: {
        AND: [
          author && {
            book_detail: {
              some: {
                author: {
                  contains: author,
                },
              },
            },
          },
          title && {
            title: {
              contains: title,
            },
          },
        ].filter(Boolean),
      },
    });
    return book;
  },
};

module.exports = Query;
