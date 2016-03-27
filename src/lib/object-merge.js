'use strict';

function objectMerge(...objs) {
  return objs.filter((obj)=> obj !== undefined).reduce((a, b)=> {
    const obj = Object.assign({}, a);
    const keys = Object.keys(b).filter((k)=> b[k] !== undefined);

    keys.forEach((k)=> {
      if (typeof b[k] === 'object' && typeof obj[k] === 'object') {
        obj[k] = objectMerge(obj[k], b[k]);
      } else {
        obj[k] = b[k];
      }
    });
    return obj;
  }, {});
}

module.exports = objectMerge;
