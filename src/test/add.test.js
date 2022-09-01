import Movies from '../modules/movies.js';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve(
    [
      {
        show: {
          id: 230,
          url: 'https://www.tvmaze.com/shows/230/go-on',
          name: 'Go On',
          type: 'Scripted',
          language: 'English',
        },
      },
      {
        show: {
          id: 228,
          url: 'https://www.tvmaze.com/shows/228/last-resort',
          name: 'Last Resort',
          type: 'Scripted',
          language: 'English',
        },
      },
    ],
  ),
}));

describe('items counter tests using Jest', () => {
  const movies = new Movies();

  test('test getMoviesCount I', async () => {
    const response = await movies.getMoviesCountNum();

    expect(response).toBe(2);
  });
});