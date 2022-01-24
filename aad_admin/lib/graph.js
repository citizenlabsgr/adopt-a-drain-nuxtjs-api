'use strict';

module.exports = class Graph {
    constructor() {
      /* $lab:coverage:off$ */
      this.graph = [];
      this.idx = 0;
    }

    getClassName() {
      return this.constructor.name;
    }

    getName() {
      return this.name;
    }

    setIdx(i) { this.idx = i; return this;}
    getIdx() {return this.idx;}
    
    addGlyph(...theArgs) {
      let glyph = '';
      for(let i in theArgs) {
        glyph += this.pad(theArgs[i]);
      }
      this.graph.push(glyph);
    }

    getGraph() {
        return this.graph.join('\n');
    }

    pad(str, padding=' ', w=24) {
      while (str.length < w ) {
         str += padding;
      }
      return str;
    }

  // $lab:coverage:on$
};
