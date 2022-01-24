'use strict';
const Step = require('./step.js');
const Util = require('./util.js');
/*
Goal: Fit documents into a single table
Strategy:
Process markdown files (.md)
Breakdown files into individual words

*/
module.exports = class BreakdownDocs extends Step {
    constructor(inputObject) {
      super();
      this.setInputs(inputObject);
      this.setOutputs(
        {documents: []}
      );
    }

    validateInputs() {
      if (!this.getInputs().documentFolder) {
        this.documentFolder = false;
        throw new Error('Input documentFolder is undefined');
      }
      if (!this.getInputs().fileList) {
        this.validInputs = false;
        throw new Error('Input fileList is undefined');
      }

      return this;
    }
    getSource() {
      return __filename.replace(__dirname,'');
    }
    padLeft(str,padding='0',sz=5) {
      while (str.length < sz) {
        str = padding + str;
      }
      return str;
    }

    async process() {

      this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`) ;
      this.addGlyph('     |','     |');

      for (let i in this.getInputs().fileList) {

        let doc_name = this.getInputs().fileList[i];
        // let doc = this.getInputs().fileList[i].replace('.','_');
        let doc = this.getInputs().fileList[i];
        let form0 = {"doc_id":`${doc_name}`, "p": 0, "i": `${this.padLeft('0')}`, "w":`${doc_name}`};

        this.getOutputs().documents[doc]=[];
        // this.getOutputs().documents[doc].push(chelate0);
        this.getOutputs().documents[doc].push(form0);

        // read file

        let data = new Util().readFile(this.getInputs().documentFolder, this.getInputs().fileList[i]);

        // break up file
        data = data.split('\n');
        let wordPos = 1;
        let paraPos = 1;
        for (let p in data) {
          let words = data[p].split(' ');

          for (let w in words) {
            let word = words[w];

            let form = {"doc_id":`${doc_name}`,
                        "p": paraPos,
                        "i": `${this.padLeft(wordPos.toString())}`,
                        "w":`${word}`};

            this.getOutputs().documents[doc].push(form);
            wordPos++;
          } // words
          paraPos++;
        } // paragraphs

        // stash words
        this.addGlyph('     |',`     + <--- [Wordify] <--- [Paragraphify] <--- (${this.getInputs().fileList[i]})`);

      } // documents


      if (this.getInputs().fileList.length === 0) {
        this.addGlyph('     |','     |');
        this.addGlyph('     |','   [No Files]');
      }
      this.addGlyph('     |','     |');

    }
    //
};
