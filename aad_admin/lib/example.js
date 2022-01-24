'use strict';
const Step = require('./step.js');

module.exports = class HelloWorld extends Step {
    constructor(inputObject) {
      super();
      this.setInputs(inputObject);
    }
    process() {
      // this.addGlyph(`A   [${this.getIdx()} ${this.getClassName()}]`);
      this.addGlyph('      [Hello World]');

      this.addGlyph('      /');
    }
};
