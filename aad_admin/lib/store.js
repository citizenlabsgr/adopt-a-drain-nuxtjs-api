'use strict';
const EnableDb = require('./enable_db.js');
// const Util = require('./util.js');
/*
  Goal: Fit documents into a single table
  Strategy:
  Process markdown files (.md)
  Breakdown files into individual words
*/
module.exports = class Store extends EnableDb {
/*
    constructor(inputObject) {
      super();
      this.setInputs(inputObject);
      this.setOutputs(
        {documents: []}
      );
    }

    validateInputs() {
      // console.log('inputs ', this.getInputs().documents);
      if (!this.getInputs().documents) {
        this.documentFolder = false;
        throw new Error('Input documents is undefined');
      }

      return this;
    }
    getSource() {
      return __filename.replace(__dirname,'');
    }

    insertDocument (chelate) {
      console.log('B chelate', chelate);
      this.insertChelate(chelate,'document');
      return this;
    }

    async process() {

      this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`);
      this.addGlyph('     |','     |');

      // for (let i in this.getInputs().documents) {
      //  this.dropDocument(i);

      // }

      for (let i in this.getInputs().documents) {
        this.addGlyph('     |',`     + <--- [insert] <--- (chelate) <--- (${i})`);
        let c = 0; // this.getInputs().documents[i];
        // console.log('c ', c);
        // for(let c in this.getInputs().documents[i]) {
          // console.log('chelate ', this.getInputs().documents[i][c]);
          await this.insertDocument(this.getInputs().documents[i][c]);
          // console.log('error ', this.err );
          if (this.err) {
            break;
          }
        // }
        if (this.err) {
          break;
        }
      }

      this.addGlyph('     |','     |');

    }
    //

    dropDocument (documentName) {

      // drop whole document
      this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
      return this;
    }
    */
};

// };
