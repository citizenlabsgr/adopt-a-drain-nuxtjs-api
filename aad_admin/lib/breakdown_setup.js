'use strict';
// const Step = require('./step.js');
const Util = require('./util.js');
const EnableDb = require("./enable_db");
/*
Goal: Setup Name and Value Pairs
Strategy:
Use markdown document as source for name pairs
Process markdown files (.md)
Breakdown files into individual name value pairs

    id := 'about'::TEXT;
	    name := 'title'::TEXT;
	    value := 'About'::TEXT;
	    form := format('{"id": "%s", "name": "%s", "value": "%s"}',id,name,value)::JSONB;

	    raise notice 'About %', api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

## Page: About
1. id: opportunity
2. title: Opportunity
3. subtitle: We-care-about-what-you-want-to-do.
4. description: Are-you-a-programmer-with-Nuxtjs-experience-who-wants-to-help-improve-and-maintain-the-Adopt-a-Drain-application?-Dont-be-shy!-We-are-always-seeking-assistance-with-the-code!-Get-involved-and-follow-our-GitHub-page.
5. item: Beginners-and-Experts
*/

// BreakdownSetup <- Step <- Graph

// module.exports = class BreakdownSetup extends Step {
module.exports = class BreakdownSetup extends EnableDb {

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

    async dropGroup(functionName, documentName) {
        // console.log('dropGroup ',functionName, documentName);
        await this.deleteGroup(`${functionName}_del`, documentName);
        // await this.deleteGroup(documentName, 'document_del');

        // this.addGlyph('     |',`     + <--- [drop] <--- (${documentName})`);
        return this;
    }
    async insertNameValue(functionName, pageForm) {
        // console.log(`insertNameValue ${functionName} ${JSON.stringify(pageForm)} `);
        await this.insertForm(pageForm, functionName);
        return this;
    }
    async process() {

      this.addGlyph(this.pad(`   [${this.getIdx()}. ${this.getClassName()}] `,'.'), `   [Validate Inputs]`,`   source: ${this.getSource()}`) ;
      this.addGlyph('     |','     |');
      let itemCnt = 0;
      for (let i in this.getInputs().fileList) {
          let doc_name = this.getInputs().fileList[i];

          // find all the name and value pairs

          if (doc_name.endsWith('.setup.md')) {
              console.log('setup filename ', this.getInputs().fileList[i]);

              // let doc = this.getInputs().fileList[i].replace('.','_');
              let doc = this.getInputs().fileList[i];
              // let form0 = {"page_id": `${doc_name}`, "name": 0, "value": `${}`};

              this.getOutputs().documents[doc] = [];
              // this.getOutputs().documents[doc].push(form0);

              // read file

              let data = new Util().readFile(this.getInputs().documentFolder, this.getInputs().fileList[i]);
              data = data.split('\n');
              // console.log('data ', data);

              // ## Page: abddddd-lk-3
              const rStart = new RegExp('^#{2} +[A-Z][a-zA-Z]+: +[a-zA-z\\.\\-\\?\\!\\_]+');

              // 1. abc: abc1-abc
              const rNV = new RegExp('^[0-9][\\. ]+[a-zA-Z_]+[:][ ]+[a-zA-Z0-9\\-\\!\\.\\?\\"\']+');
              let key = '';
              let functionName = '';
              // let idName = '';
              // const re = new RegExp('ab+c');
              // let item = {"page_id": "", "name": "", "value": ""};

              for (let p in data) {
                  // console.log('page ', data[p].match(rStart));

                  // if (data[p].trim().startsWith('## Page:')) {
                  if (data[p].match(rStart)) {
                      let s = data[p].split(':');
                      functionName = s[0].split(' ')[1].trim().toLowerCase();
                      // console.log('s ', s);
                      // idName = s[0].split(' ')[1].replace('-','').toLowerCase();
                      key = s[1].trim().toLowerCase();
                      // console.log('key', key);
                      // console.log('idName', idName);
                      itemCnt = 0;
                      // this.addGlyph('     |', `     + <--- [Pageify] <-- [${key}] <--- (${this.getInputs().fileList[i]})`);
                      // this.addGlyph('     |', `     + <--- [drop] <--- (${functionName}#${key})`);
                      // await this.dropGroup(functionName, key);
                  } else if (data[p].match(rNV)) {
                      // console.log('nameValue ', key.toLowerCase(), data[p]);
                      let s = data[p].split('.');
                      s = s[1].split(':');
                      // console.log('n', n);
                      let n = s[0].trim().toLowerCase();
                      let v = s[1].trim();
                      let form = JSON.parse(`{"id": "${key}", "name": "${n}", "value": "${v}"}`);
                      // let form = JSON.parse(`{"id": "${idName}#${key}", "name": "${n}", "value": "${v}"}`);
                      // let form = JSON.parse(`{"${idName}_id": "${key}", "name": "${n}", "value": "${v}"}`);
                      this.addGlyph('     |', `     + <--- [insert] <--- (${n}:${v})`);

                      if (n === 'item') {

                          form.name = `${form.name}_${itemCnt}`;
                          itemCnt++;
                      }
                      // this.getOutputs().documents[doc].push(form);
                      await this.insertNameValue(functionName, form);

                      // console.log( form);
                      // console.log( {"page_id": \`${key}\`, "name": "${n[0].trim().toLowerCase()}", "value": "${n[1].trim()}"\`});
                      // console.log( {"page_id": `${key}`, "name": "${n[0].trim().toLowerCase()}", "value": "${n[1].trim()}"`});

                  }


              }

              /*
              // break up file
              data = data.split('\n');
              let wordPos = 1;
              let paraPos = 1;
              for (let p in data) {
                  let words = data[p].split(' ');

                  for (let w in words) {
                      let word = words[w];

                      let form = {
                          "doc_id": `${doc_name}`,
                          "p": paraPos,
                          "i": `${this.padLeft(wordPos.toString())}`,
                          "w": `${word}`
                      };

                      this.getOutputs().documents[doc].push(form);
                      wordPos++;
                  } // words
                  paraPos++;
              } // paragraphs

              // stash words
              this.addGlyph('     |', `     + <--- [Wordify] <--- [Paragraphify] <--- (${this.getInputs().fileList[i]})`);
              */
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
