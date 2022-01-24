'use strict';

const EnableDb = require('./enable_db.js');

module.exports = class StoreDocs extends EnableDb {
  constructor(inputObject) {
    super();
    this.setInputs(inputObject);
    this.setOutputs({documents: []});
  }

  validateInputs() {
      if (!this.getInputs().documents) {
        throw new Error('Input documents is undefined');
      }
      return this;
  }

  getSource() {
    return __filename.replace(__dirname,'');
  }

  async dropDocument(documentName) {
    await this.deleteDocument(documentName, 'document_del');
    // this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
    return this;
  }

  async insertWord(wordForm) {
    await this.insertForm(wordForm, 'document');
    return this;
  }

  async process() {
    this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`);
    this.addGlyph('     |','     |');
    // delete existin documents
    for (let i in this.getInputs().documents) {
      this.addGlyph('     |',`     + <--- [drop] <--- (document: ${i})`);
      await this.dropDocument(i);
    }
    // insert fresh copy of document

    for (let i in this.getInputs().documents) {
      this.addGlyph('     |',`     + <--- [insert] <--- (word) <--- (${i})`);
      for(let c in this.getInputs().documents[i]) {

        await this.insertWord(this.getInputs().documents[i][c]);
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
