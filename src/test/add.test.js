import addItem from '../modules/add.js';

describe('test items counter add function', () => {
  test('test add 20 + 20', () => {
    const sum = addItem(20, 30);
    expect(sum).toBe(50);
  });
});