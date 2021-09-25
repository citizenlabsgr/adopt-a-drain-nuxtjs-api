'use strict';

module.exports = class ApiDebug {
  constructor(apiName, apiDebug) {
      this.debug = apiDebug;
      this.apiName = apiName;
  }
  
  shorten(textVal, len) {
    /* $lab:coverage:off$ */
    if (!textVal) {
        return textVal;
    }
    if (textVal.length < len) {
        return textVal;
    }
    return textVal.substring(0,len) + ' ...';
    /* $lab:coverage:on$ */
  }

  hide(nm, textVal) {
      /* $lab:coverage:off$ */
      if (nm === 'password') {
          return '********';
      }
      return textVal;
      /* $lab:coverage:on$ */
  }
  list(jsonObj, levelName){
    /* $lab:coverage:off$ */
    if (!jsonObj) {return 'None';}
    for (let nm in jsonObj) {
      switch(typeof jsonObj[nm]) {
        case 'number':
          console.log('     - ', levelName + '.' + nm, jsonObj[nm]);
          break;
        case 'boolean':
          console.log('     - ', levelName + '.' + nm, jsonObj[nm]);
          break;
        case 'string':
          console.log('     - ', levelName + '.' + nm, this.shorten(this.hide(nm,jsonObj[nm]),20));
          break;
        default: 
          this.list(jsonObj[nm], levelName + '.' + nm ); 

      }
    }
    return '';
    /* $lab:coverage:on$ */
  }
  show(header, body, result) {
     /* $lab:coverage:off$ */
     if (!this.debug) { return;}

     if(header){
         console.log('    Debug HEADER for ', this.apiName);
         this.list(header,'');
         console.log('    Debug Authorization is ', this.shorten(header.authorization, 25) || 'None') ;
         console.log('    Debug Test is ' );
         this.list(header.test,'');
     } else {
         console.log('    Debug missing ', this.apiName, ' header' );
     }
     
     if (body) {
         console.log('    Debug BODY for', this.apiName);
         console.log('    Debug BODY is ');
         this.list(body,'');
     } else {
        console.log('    Debug missing ', this.apiName, ' body' );
     }

     if (result) {
        console.log('    Debug RESULT for', this.apiName);
        console.log('    Debug RESULT is ');
        this.list(result,'');
    } else {
       console.log('    Debug missing ', this.apiName, ' result' );
    }     
    return this;
    /* $lab:coverage:on$ */
  }
};
