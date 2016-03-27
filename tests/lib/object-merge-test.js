import test from 'ava';
import objectMerge from '../../src/lib/object-merge';

const obj1 = {
  a: {
    aa: { value: 10 },
    ab: { value: 20 }
  },
  b: {
    ba: { value: 30 },
    bb: {
      bba: { value: 40 }
    },
    bc: 'not-undefined'
  }
};

const obj2 = {
  a: {
    aa: { value:20 }
  },
  b: {
    ba: {
      baa: { value: 50 }
    },
    bc: undefined
  },
  c: {
    ca: 10,
    cb: { value: 30 }
  }
};

const obj1and2 = {
  a: {
    aa: { value: 20 },
    ab: { value: 20 }
  },
  b: {
    ba: {
      value: 30,
      baa: { value: 50 }
    },
    bb: {
      bba: { value: 40 }
    },
    bc: 'not-undefined'
  },
  c: {
    ca: 10,
    cb: { value: 30 }
  }
};

test('it should merge the objects', (t) => {
  const res = objectMerge(obj1, obj2);
  t.same(res, obj1and2);
});
