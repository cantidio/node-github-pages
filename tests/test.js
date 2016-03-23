import test from 'ava';
import Dummy from '../src/lib';

test('sum', (t) => {
  let a = new Dummy();
  t.is(a.sum(), 5);
});

test('bar', async (t) => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});
