'use strict';
const Graph = require('./graph.js');
module.exports = class Step extends Graph {
    constructor() {
      super();
      /* $lab:coverage:off$ */
      this.inputs = false;
      this.outputs = false;
      this.validInputs = true;
      this.result = false;
      this.err = false;
      this.errMessage = false;
      this.version = false;
      this.kind = false;
      // this.client = false;
    }
    setError(errorMsg) {
      this.err = true;
      this.errMessage = errorMsg;  
    }

    getSource() {
      return __filename.replace(__dirname,'');
    }

    getVersion() { // ok
      return this.version;
    }
    setVersion(vrsn) { // ok
      this.version = vrsn;
      return this;
    }

    getClassName() { // ok
      return this.constructor.name;
    }

    getName() { // ok
      return this.name;
    }

    setName(nm) { // ok
      this.name = nm;
    }

    getInputs() { // no
      return this.inputs;
    }

    setInputs(inputObject){ // no
      this.inputs = inputObject;
      return this;
    }
    getInputKeys() { // no
      if (this.inputs) {
        let keys = Object.keys(this.inputs);
        return keys.join(',');
      }
      return "None";
    }
    getOutputs() { // no
      return this.outputs;
    }
    setOutputs(outputObject){ // no
      this.outputs = outputObject;
      return this;
    }
    getOutputKeys() { // no
      if (this.outputs) {
        let keys = Object.keys(this.outputs);
        return keys.join(', ');
      }
      return "None";
    }

    setIdx(i) { // no
      this.idx = i; return this;
    }
    getIdx() { // no
      return this.idx;
    }

    isValid() { // no
      return this.validInputs;
    }

    validateInputs() { // no
      this.validInputs = true;
      return this.validInputs;
    }

    async run() { // ok
      try {

        this.addGlyph(`     | (inputs) `,`   (${this.getInputKeys()})`);

        this.addGlyph('     |','     |');

        this.validateInputs();
        await this.process();
        this.addGlyph(`     | (outputs)`,`   (${this.getOutputKeys()})`); // eg (filelist)

      } catch(err) {
        this.err = true;
        this.errMessage = err;
        this.addGlyph(`     |`,`     |`);
        this.addGlyph(`     |`,`   (${this.errMessage})`);
        // this.addGlyph(`      [${this.getIdx()} ${this.getClassName()}.process ${this.errMessage}] ---> [ = ]`);
      }
      return this;
    }

    async process() {
       // this.addGlyph(`   [${this.getIdx()}. ${this.getClassName()}] `, `   [placeholder]`);
       this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [placeholder]`,`   source: ${this.getSource()}`);

       this.addGlyph(`     |`,`     |`);
       // return this;
    }

  // $lab:coverage:on$
};
