'use strict';

// [Configure test from chelate]

module.exports = class Template {
    // constructor(token_name, claim, api_settings) {
    constructor(token_name, claim, api_settings, chelate) {
         // console.log('---------------------IN ', this.constructor.name);
        this.token_name = token_name;
        this.claim = claim;
        this.api_settings = api_settings;
        this.chelate = chelate;
        // console.log('api_settings',  api_settings);
        this.kind = this.api_settings.name.kind;
        this.version = this.api_settings.name.version;
        this.function_name=this.api_settings.name.name;
        this.parameter_types = this.getParameterTypes(this.api_settings.params);
        this.parameters = this.getParameters(this.api_settings.params);
        this.method = this.api_settings.method.toUpperCase();
        
        this.token = false;
        this.id = false;
        this.form = false;
        this.mbr = false;
        this.ownerId = false;
        // /////////////////////
        // Configure Test Values
        // ////////////////////
        // 1 token
        // Token required by all API methods 
        // api_setting.params must contain {"name":"token", "type":"TOKEN"}
        
        this.validate();

        if (this.token_name) { 
            this.token = this.getToken();
        }
        // console.log('chelate' , this.chelate);
        // console.log('chelate 1',chelate);
        if (this.chelate) {
            // console.log('chelate 2', this.chelate);
            if (this.chelate.form) {
              //  console.log('chelate 3');
              // 2 chelate  
              // POST, PUT require chelate
              this.id = this.chelate.pk.split('#')[1];
              this.form = JSON.stringify(this.chelate.form);
              this.ownerId = `${this.chelate.owner}`;
              // this.mbr = this.chelate.form;

              // this.mbr=;
            } else { // this is form not a chelate
                // console.log('chelate 4');

                // 3 criteria
                // GET can accept a critera {username:"", password:""} 
                //                  mbr {north:N.N,south:N.N,west:N.N,east:N.N}
                this.form = JSON.stringify(chelate);
                // this.mbr = chelate;
            }
        } 
// console.log('class', this.constructor.name);
// console.log('A id',this.id);
 // console.log('A form', this.form);
// console.log('A mbr', this.mbr);

// console.log('A ownerId',this.ownerId);
        // this.mbr = this.form;
        if (this.hasType('MBR') && this.api_settings.mbr) {
            this.mbr = this.api_settings.mbr;
            // console.log('mbr found', this.mbr);
            // console.log('north', this.mbr.north);
            this.mbr = `,'(${this.mbr.north},${this.mbr.south},${this.mbr.west},${this.mbr.east})'::MBR`;
            // console.log('mbr',this.mbr);
        } else if (this.hasType('MBR') && !this.api_settings.mbr) {
           // missing mbr
           throw new Error('Api_settings is missing mbr key and value');

        } else {
            this.mbr = '';
        }
        
        if (this.hasType('IDENTITY')) {
            // PUT, GET, DELETE accept have id
            this.id = `,'("${this.id}")'::IDENTITY`;
        // } else if (this.hasType('VARCHAR')) {
            // console.log(`Template Varchar "${this.id}"`);
            // DELETE 
            // this.id = `,'${this.id}'::VARCHAR`;
        }  else {
            this.id = '';
        }
        
        if (this.hasType('JSON')) {
            this.form = `,'${this.form}'::JSON`;
        } if (this.hasType('JSONB')) {
            this.form = `,'${this.form}'::JSONB`;
        } else {
            this.form = '';
        }
        
        if (this.hasType('OWNER_ID')) {
            this.ownerId = `,'("${this.ownerId}")'::OWNER_ID`;
        } else {
            this.ownerId = '';
        }
        /*
        console.log('        E function_name',this.function_name);
        console.log('        E id', this.id);
        console.log('        E form', this.form);
        console.log('        E ownerId', this.ownerId);
        console.log('        E mbr', this.mbr);

     console.log('---------------------OUT');
        */
    }
    getClassName() {
        return this.constructor.name;
    }
    validate() {
        console.log('          - ', this.getClassName());
        if (!this.hasType('TOKEN')) {
            throw new Error(`Token parameter required in ${this.api_settings.name.name} `);
        }
    }
    /*
    getTestParameters() {
        let rc= '';
        for(let i in this.parameters) {
            console.log('i', i);
        }
        return rc;
    }
    */
    /*
    formatParameter(param_name) {
        // param is {name:"",type: "", [default:""]}
        let rc = '';

        for (let i in param) {
            console.log('param ', i);
            // rc += this.api_settings;
        }
        return rc;
    }
    */
    
    getToken() {
        // some templates dont use tokens
        if (!this.token_name || !this.claim) {
            return '';
        }

        let jwt_secret = `base_0_0_1.get_jwt_secret()`;
        let jwt_claims = JSON.stringify(this.claim);
        return `base_0_0_1.sign('${jwt_claims}'::JSON, ${jwt_secret}::TEXT)::TOKEN`;
    }

    getParameter(pname) {
        for (let i in this.api_settings.params) {
            let param_name = this.api_settings.params[i].name;
            console.log('getParameter param_name', param_name);
            if (pname === param_name) {   
                return this.api_settings.params[i];
            }
        }
        return false;
    }
    getParameterByType(ptype) {
        for (let i in this.api_settings.params) {
            let param_type = this.api_settings.params[i].type;
            console.log('getParameter param_name', param_type);
            if (ptype === param_type) {   
                return this.api_settings.params[i];
            }
        }
        return false;
    }
    hasType(param_type) {
        
        for (let i in this.api_settings.params) {
            let ptype = this.api_settings.params[i].type;
            if (ptype === param_type) {   
                return true;
            }
        }
        return false;
    }

    getParameterTypes(params) {
        let parameter_types = '';
        for (let ps in params) {
            if(parameter_types.length > 0) { parameter_types += ',';}
            parameter_types += params[ps].type;
        }
        return parameter_types;
    }

    getParameters(params) {
        let parameters = '';
        for (let ps in params) {
            if(parameters.length > 0) { parameters += ',';}
            parameters += params[ps].type;
          }
        return parameters;  
    }


    templatize() {

        return `overload`;
        
    }
};