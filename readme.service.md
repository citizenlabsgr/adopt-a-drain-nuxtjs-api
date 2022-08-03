# Creating a Service
1. Name service (use noun and avoid verbs)
2. Determine service's function scope (Delete, Get, Post, Put)
3. Determine service's permissions (admin, user, guest)
4. Determine service-function parameter patterns
5. 
6. Name service-functions
7. 
8. Configure function tests /api-gen/settings/settings.json
9. Determine service's data pattern (pk,sk,tk,form,active,owner,created,updated)
10. Configure function test data /api-gen/settings/settings.json
11. Execute geterate-test.js
12. Tricks
    1. use TestHelper to load test data
    2. 
13. Issues
    1. MaxListenersExceededWarning:...
        1. Solution: Increase the number of listeners
            1. In hapi_pg_pool_plugin.js increase variable maxListeners
            2. e.g., let maxListeners=19;
14. Development
    1. Create Test
        1. Create or update service tests (delete,get,post,put)  
           1. file: /test/route.integration.test.js
           2. 
        2. Run Tests
           1. command window: "docker-compose exec db-api npm run test-integration"
           2. 
    2. Develop Route Code 
       1. create route files
          1. folder: lib/routes/
          2. <service-name>_route_delete.js
          3. <service-name>_route_get.js
          4. <service-name>_route_post.js
          5. <service-name>_route_put.js
       2. integrate new route files into server.js
          1. file: lib/server.js
             1. include route file e.g., const <server-nam>_route_post = require('./routes/<server-name>_route_post.js');
             2. add route constant to "api_routes" array
        
    3. Update Database Model
       1. create SQL function 
          1. folder: models/db/<service-name>/<version>
          2. function_<service-name>\_delete_<param-types>
          3. function_<service-name>\_get_<param-types>
          4. function_<service-name>\_post_<param-types>
          5. function_<service-name>\_put_<param-types>
       2. Update settings
          1. add function definition 
          2. file: /api-gen/settings/settings.json
          3. add sample items 
          4. file: //api-gen/settings/setting.data.json
       3. update database deployment 
          1. include SQL function file
             1. e.g., const FunctionPagePostToj = require(`./db/page/${page_version}/function_page_post_toj.js`); 
             2. file: models/db/<service-name>/db.deploy.js
          2. Add SQL function constant to "runner"
             1. e.g., runner.add(new FunctionPagePostToj('api', apiVersion, baseVersion))
             2. file: models/db/<service-name>/db.deploy.js


    4. Deploy database
       1. Update the db.deploy.js script
       2. command window: "docker-compose exec db-api npm run db-deploy" 
       3. or /scripts/db.deploy.sh

    5. Repeat until code passes all tests
    

# What 
## Deploy database
Deploy the database, functions
What
* script: db.deploy.js
* bash script: scripts/db.deploy.sh 
* load database extentions
* create schema when not found
* create custom types
* create table when not found 
* drop unwanted functions when found
* create base functions when not found
* create api functions when not found

# How
* Make base class to connect and run commands (lib/runner/step.js)
* Wrap postgres commands in javascript classes (models/db/*)
* Use js function to deploy postgres commands (models/db.deploy.js)

## Create an SQL Function
* debug

## Create a class wrapper for SQL Function
* folder: models/db/<serviceName>/<serviceVersion>
* manually create function template
* file name pattern: function_<serviceName>_delete_<paramPattern>

## Add class wrapper to db.deploy.js
* folder: models/db/<serviceName>/<serviceVersion> 

## Run Deploy (Developement Only)
Docker:
* docker-compose: runs models/db.deploy.js on start up
* command line: docker-compose exec db-api npm run db-deploy
* manually (mac command window only) 
  * cd adopt-a-drain-hapi-api/scripts
  * ./db.deploy.sh

## Add Test

## Run Tests

# Data
pk, sk, and tk values are lowercase 
pk + sk must be unique value
constant value pattern "const#TITLE" 


## Data Style
  Record

    pk: "page_id#about"
    sk: "name#title"
    tk: "value#this-is-us"
    form: {"page_id": "about", "name": "title", "value": "This-is_Us"}
    owner: <owner>
    created: <datetime>
    updated: <datatime>
    active: true

Keys
* __pk__ pattern is \<formKey>#\<formKeyValue>
* __sk__ pattern is \<formKey>#\<formKeyValue>
* __tk__ pattern is \<formKey>#\<formKeyValue>
* __form__ pattern is
  * id:id-value, 
  * name:name-value, 
  * value:value

# Functions
## Delete Function
* Pass Parameters: token, owner_id, identity
* Validate Token
* Assemble Data
* Call delete function
* Return delete result

## Get Function
* Pass Parameters: token, owner, identity
* Validate Token, fail 403
* Validate Owner
* Validate Identity 
* Assemble Data
* Call query function
* Return query function result

## Post Function
* Pass Parameters: token, owner, form
* Validate token, required, fail 403
* Owner is required
* Validate form, required
  * Required form fields must exist, fail 400
* Assemble Data
* Call insert function
* Return insert function result

## Put Function
* Pass Parameters: token, owner, identity, form
* Validate token, required, fail 403
* Owner is required
* Identity is required, not null, fail 400
* Validate form is required, not null
  * Required form fields must exist, fail 400
  * At least one field must have a change 
* Assemble Data
* Call update function
* Return update function result


