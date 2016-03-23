'use strict';

module.exports = class Dummy {
  constructor(flags) {
    this.flags = flags;
  }

  run() {
    console.log('flags:');
    console.log(this.flags);
  }

  sum() {
    return 5;
  }
};
