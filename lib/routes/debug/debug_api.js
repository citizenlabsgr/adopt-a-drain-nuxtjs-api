'use strict';

module.exports = class ApiDebug {
  constructor(apiName, apiDebug) {
      this.debug = apiDebug;
      this.apiName = apiName;
  }
  
  shorten(textVal, len) {
    if (!textVal) {
        return textVal;
    }
    if (textVal.length < len) {
        return textVal;
    }
    return textVal.substring(0,len) + ' ...';
  }
  hide(nm, textVal) {
      if (nm === 'password') {
          return '********';
      }
      return textVal;
  }
  list(jsonObj){
    if (!jsonObj) {return 'None';}
    for (let nm in jsonObj) {
       if (typeof jsonObj[nm] === 'string') {
         console.log('     - ', nm, this.shorten(this.hide(nm,jsonObj[nm]),20));
       } else {
         // console.log('     _ ', nm, JSON.stringify(jsonObj[nm])); 
         this.list(jsonObj[nm]); 

       }
    }
    return '';
  }
  show(header, body, result) {
     if (!this.debug) { return;}
     if(header){
         console.log('    Debug HEADER for ', this.apiName);
         this.list(header);
         console.log('    Debug Authorization is ', this.shorten(header.authorization, 25) || 'None') ;
         console.log('    Debug Test is ' );
         this.list(header.test);
     } else {
         console.log('    Debug missing ', this.apiName, ' header' );
     }
     
     if (body) {
         console.log('    Debug BODY for', this.apiName);
         console.log('    Debug BODY is ');
         this.list(body);
     } else {
        console.log('    Debug missing ', this.apiName, ' body' );
     }
     if (result) {
        console.log('    Debug RESULT for', this.apiName);
        console.log('    Debug RESULT is ');
        this.list(result);
    } else {
       console.log('    Debug missing ', this.apiName, ' result' );
    }     
     return this;
  }
};
