import Movies from '../modules/movies.js';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve(
    [
        {
            "username": "hamid",
            "creation_date": "2022-08-31",
            "comment": "sas"
        },
        {
            "creation_date": "2022-08-31",
            "username": "ddd",
            "comment": "ddd"
        }
    ],
  ),
}));

describe('comment counter tests using Jest', () => {
  const movies = new Movies();

  test('test Comment Count ', async () => {
    const response = await movies.getComment(4);
    expect(response.length).toBe(2);
  });
});