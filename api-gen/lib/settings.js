

const fs = require('fs');

module.exports = class Settings {
    constructor() {
        // let settings = JSON.parse(fs.readFileSync(`${__dirname}/settings/settings.json`));
        this.settings = false;
    }
    load(prefix='') {
        // settings.js is ../settings/settings.json
        if (prefix !== '') {
            prefix += '_';
        } 
        console.log('dir ' , __dirname);
        let filename = `${__dirname.replace('/lib','')}/${prefix}settings/settings.json`;
        let dataname = `${__dirname.replace('/lib','')}/${prefix}settings/settings.data.json`;

        console.log('load settings', filename);
        this.settings = JSON.parse(fs.readFileSync(filename));
        let data =  JSON.parse(fs.readFileSync(dataname));
        this.settings['data'] = data.data;
        return this;
    }
    get(prefix='') {
        if (!this.setting) {
            this.load(prefix);
        }
        return this.settings;
    }
};    