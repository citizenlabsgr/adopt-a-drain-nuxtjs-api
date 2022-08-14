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

  async dropGroup(functionName, documentName) {
    // console.log('dropGroup ',functionName, documentName);
    await this.deleteGroup(`${functionName}_del`, documentName);
    // await this.deleteGroup(documentName, 'document_del');

    // this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
    return this;
  }

  async insertWord(wordForm) {
    await this.insertForm(wordForm, 'document');
    return this;
  }
  /*
  async dropNameValue(functionName, pageName) {
    await this.deletePage(pageName, `${functionName}_del`);
    // this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
    return this;
  }

   */
  /*
  async insertNameValue(functionName, pageForm) {
    // console.log(`insertNameValue ${functionName} ${JSON.stringify(pageForm)} `);
    await this.insertForm(pageForm, functionName);
    return this;
  }
   */

  async process() {
    this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Clear Data]`,`   source: ${this.getSource()}`);
    this.addGlyph('     |','     |');
    // console.log('process 1');

    // Drop existing document
    /*
    for (let i in this.getInputs().documents) {
        // for (let fn of Object.keys(this.getInputs().documents)) {
        if (i.endsWith('.document.md')) {

          let functionName = 'document';
          this.addGlyph('     |', `     + <--- [drop] <--- (document: ${i})`);
          await this.dropGroup(functionName, i);

        } else if (i.endsWith('.setup.md')) {

          let lastItemId = '';
          let functionName = 'page';
          for (let k in this.getInputs().documents[i]) {
            let itemId = this.getInputs().documents[i][k].id;
            // let itemId = this.getInputs().documents[i][k].page_id;

            if (lastItemId !== itemId) {
              lastItemId = itemId;
              this.addGlyph('     |', `     + <--- [drop] <--- (${itemId})`);
              await this.dropGroup(functionName, itemId);

            }
            // await this.dropGroup(functionName, itemId);
          }

        }
    }
    */
    // console.log('process 2');

    // insert fresh copy of document
    // console.log('process 2.1', this.getInputs().documents);

    // Add Document

    for (let i in this.getInputs().documents) {
      // console.log('process 2.2', Object.keys(this.getInputs().documents));
      console.log('process inputs i ', i);

      // Documents

      if (i.endsWith('.document.md')) {  // Document Document
        this.addGlyph('     |', `     + <--- [insert] <--- (word) <--- (${i})`);

        for (let c in this.getInputs().documents[i]) {

          // console.log('process 2.2', this.getInputs().documents);

          await this.insertWord(this.getInputs().documents[i][c]);

          if (this.err) {
            console.log('break a');
            break;
          }
          // console.log('process 2.3');
        }

      } else if (i.endsWith('.setup.md')) {  // Setup Document
        /*
        let functionName = 'page';

        for (let i in this.getInputs().documents) {
          let lastItemId = '';
          for (let k of this.getInputs().documents[i]) {
            let itemId = k.id; // this.getInputs().documents[i][k];

            // let itemId = k.page_id; // this.getInputs().documents[i][k];

            if (lastItemId !== itemId) {
              lastItemId = itemId;
              this.addGlyph('     |', `     + <--- [insert] <--- (${itemId})`);
            }
            //             console.log('process functionName ', functionName, this.getInputs().documents[i][k]);
            // console.log('process functionName ', functionName, k);
            await this.insertNameValue(functionName, k);
            // await this.insertNameValue(functionName, this.getInputs().documents[i][k]);

          }
        }
        */
        // console.log(' found ',i);
      }
      // console.log('process 3');
      if(this.err){
        console.log('break b');
        break;
      }
    }
    this.addGlyph('     |','     |');

    // console.log('process out');


  }

};
