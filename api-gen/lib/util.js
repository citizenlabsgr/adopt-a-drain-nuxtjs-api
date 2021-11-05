'use strict';
const path = require('path');
const fs = require('fs');
const { split } = require("core-js/fn/symbol");

module.exports = class Util {
    toProperCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
    }
    toTitleCase(str) {
        let rc = '';
        let parts = str.split('-');
        for(let i in parts) {
            rc += this.toProperCase(parts[i]);
        }
        return rc;
    }
    getFileList(directoryPath) {
      let rc = [];
      console.log('getFileList 1 ', directoryPath);
      
      /*
      fs.readdir(directoryPath, function (err, files) {
        // handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        // listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });

      });
      */
      console.log('getFileList out');

      return rc;
    }

};  