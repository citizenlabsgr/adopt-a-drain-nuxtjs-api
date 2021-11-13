'use strict';
module.exports = class Step {
    constructor(kind, version) {
      /* $lab:coverage:off$ */
      this.result = false;
      this.err = false;
      this.sql = 'xxxxx';
      this.kind = kind;
      this.version = version;
      this.name = `${this.kind}_${this.version}`;
      /* $lab:coverage:on$ */
    }
    // $lab:coverage:off$
    /*
    setKind(knd) {
      this.kind = knd;
    }
    */
    /*
    setName(nm) {
      this.name = nm;
    }
    */
    /*
    setVersion(vrsn) {
      this.version = vrsn;
    }
    */

    getClassName() {
      return this.constructor.name;
    }

    getName() {
      return this.name;
    }
    
    async script() {
      console.log('sql', this.sql);
      return this.sql;
    }

    async run(client) {
      // console.log('run 1', this.getClassName());
        this.client = client;
        // console.log('run 2', this.getClassName());
        await this.process(client);  
        // console.log('run out', this.getClassName());
        return this;
    }

    async process(client) {
      // console.log('  process 1', this.getClassName());
      // console.log('  client ', client);
      console.log('  -', this.getName());
      if (!client) {
        console.log('** Step BAD CLIENT');
      }
      // console.log('** ', this.getClassName(), this.getName());
      // console.log('  sql ', this.sql);
      this.result = await client.query({
        text: this.sql
      }).then(result => {
          this.result = [];
          // console.log('  process 2', this.getClassName());
          for (let res in result) {
            
            if (result && result[res] && result[res].command && result[res]['command'] === 'SELECT') {
              this.result.push(result[res]['rows']);
            }
            
          }
          // console.log('  process 3', this.getClassName());

          this.show();
          // console.log('  process 4', this.getClassName());

      })
      .catch(e => {
          // this.err = e;
          console.error('** Step err', e);
      });
      // console.log('  process out', this.getClassName());

    }

    show() {
      /* $lab:coverage:off$ */
      for (let i in this.result) {
        if (this.result[i][0]) {
          console.log('    ---- ',i, this.result[i][0]);
        }
      }
      /* $lab:coverage:on$ */
    }
  // $lab:coverage:on$
};