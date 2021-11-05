const Template = require('./template.js');
module.exports = class HasFunctionTemplate extends Template {
    constructor(api_settings) {
        super(false,false,api_settings,false);
        // console.log('HasFunctionTemplate', api_settings);
        
    }

    templatize() {
        let commentstart='';
        let commentend='';
        if (this.hasType('TOKEN')) {
            // [Work-around pgtap bug with user defined types and hasFunction]
            commentstart = '/* Work-around pgtap bug with user defined types and hasFunction';
            commentend = '*/';
        }
        return `
        ${commentstart}
        SELECT has_function(
  
            '${this.kind}_${this.version}',
      
            '${this.function_name}',
      
            ARRAY[${this.parameter_types}],
      
            'DB Function ${this.method} ${this.function_name} (${this.parameter_types}) exists'
      
        );
        ${commentend}
        `;
    }
};