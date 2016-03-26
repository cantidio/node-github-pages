import test from 'ava';

test('sum', (t) => {
  t.is(5, 5);
});

test('bar', async (t) => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});
