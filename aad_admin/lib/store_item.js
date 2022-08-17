/*
'use strict';

const EnableDb = require('./enable_db.js');

module.exports = class StoreItem extends EnableDb {
  constructor(inputObject) {
    super();
    this.setInputs(inputObject);
    this.setOutputs({pairs: []});
  }

  validateInputs() {
      if (!this.getInputs().pairs) {
        throw new Error('Input pairs is undefined');
      }
      return this;
  }

  getSource() {
    return __filename.replace(__dirname,'');
  }

  async dropItem(documentName) {
    await this.deleteItem(documentName, 'document_del');
    // this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
    return this;
  }

  async process() {
    this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`);
    this.addGlyph('     |','     |');
    // delete existin pairs
    for (let i in this.getInputs().pairs) {

      this.addGlyph('     |',`     + <--- [drop] <--- (document: ${i})`);
      await this.dropItem(i);
    }
    // insert fresh copy of document

    for (let i in this.getInputs().pairs) {
      this.addGlyph('     |',`     + <--- [insert] <--- (word) <--- (${i})`);
      for(let c in this.getInputs().pairs[i]) {

        await this.insertWord(this.getInputs().pairs[i][c]);
        if(this.err){
          console.log('break a');
          break;
        }
      }
      if(this.err){
        console.log('break b');
        break;
      }
    }

  }

};
*/