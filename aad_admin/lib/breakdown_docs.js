'use strict';
const Step = require('./step.js');
const Util = require('./util.js');
// const EnableDb = require("./enable_db");
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
      // process files ending in ".document.md" into lines
      // process lines into words
      // doc_id: <docName>, name: <paragraphNo>.<wordNo>, value: <word>
      // pk:doc_id#<docName> , sk: name#<paragraphNo>.<wordNo>, tk: value#<word>
      this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`) ;
      this.addGlyph('     |','     |');
      // process files into lines
      for (let i in this.getInputs().fileList) {
          let docName = this.getInputs().fileList[i];

          if (docName.endsWith('.document.md')) {

              let doc = this.getInputs().fileList[i];
              // let form0 = {"doc_id": `${docName}`, "p": 0, "i": `${this.padLeft('0')}`, "w": `${docName}`};

              this.getOutputs().documents[doc] = [];
              // this.getOutputs().documents[doc].push(form0);

              // read file

              let data = new Util().readFile(this.getInputs().documentFolder, this.getInputs().fileList[i]);

              // break up file
              data = data.split('\n');

              let paraNo = 0; // 1;
              let wordCount = 0;
              for (let p in data) {
                  let words = data[p].split(' ');
                  let wordNo = 0; // 1;
                  for (let w in words) {
                      let word = words[w];

                      let form = {
                          "id": `${docName}`,
                          "name": `${this.padLeft(paraNo.toString())}.${this.padLeft(wordNo.toString())}`,
                          "value": `${word}`
                      };
                      /*
                      let form = {
                          "doc_id": `${docName}`,
                          "p": paraNo,
                          "i": `${this.padLeft(wordNo.toString())}`,
                          "w": `${word}`
                      };

                       */
                      // console.log('form ', form);
                      this.getOutputs().documents[doc].push(form);
                      wordNo++;
                      wordCount++;

                  } // words
                  paraNo++;
              } // paragraphs

              // stash words
              this.addGlyph('     |', `     + <--- [Wordify ${wordCount}] <--- [Paragraphify ${paraNo}] <--- (${this.getInputs().fileList[i]})`);
        } // if
      } // documents


      if (this.getInputs().fileList.length === 0) {
        this.addGlyph('     |','     |');
        this.addGlyph('     |','   [No Files]');
      }
      this.addGlyph('     |','     |');

    }
    //
};
