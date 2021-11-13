'use strict';
const fs = require('fs');

module.exports = class FileHelper {
    constructor(folder, name) {
        this.folder = folder;
        this.name = name;
    }
    write(lines) {
        fs.writeFile(`${this.folder}/${this.name}`, lines, err => {
            if (err) {
            console.error(err);
            return;
            }
            // file written successfully
        });
    }
    delete() {
        try {
            if (fs.existsSync(`${this.folder}/${this.name}}`)) {
                fs.unlink(`${this.folder}/${this.name}}`, (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  
                    console.log(`   [* Removing ${this.name}]`);
                  });
            } else {
                console.log(`   [* Removed ${this.name}]`);
            }
        } catch(err) {
            console.error(err);
        }
    }
};