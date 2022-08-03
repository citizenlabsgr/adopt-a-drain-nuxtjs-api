
extend name and value pair

Page extends Step

Requires
* Title

Optional
* Subtitle
* Description
* 

* Get all page items
* Get individual page item (title, subtitle, description, ...)
```mermaid
need to find and install mermaid for webstorm

%%{init: {'securityLevel': 'loose', 'theme':'base'}}%%
stateDiagram
 
[*] --> [*] : not(/pageName)
[*] --> Config : /pageName
Env --> Load : AAD_API_TOKEN
Config --> Load : (page(pageName))
Load --> Show : ((page), (title, subtitle, description))
Show --> [*] : not(/pageName)
 
Show --> Show : /pageName
```


# Design Considerations
* functions include __Create__, __Read__, __Update__ and __Delete__
* _guests_, _users_ and _admins_ can __Read__ the page's name-value pairs
* only _admins_ can __Create__, __Update__, or __Delete__ the page's name-value pairs
* test data is found in api-gen/setting/settings.json
* name pairs may not be the same from page to page
* expect return to have none, one, or many NameValue pairs
* create database tests before writing the postgres functions
* concatination of tk and sk must create a unique key
* tk has the pattern page#<pageName>
* pageName cannot have spaces
* sk has the pattern const#itemName
* itemName should be uppercase, by convention 
* 

# Design Issues
* Should admins have an ownership scope for different jurisdictions
* Should there be an UberAdmin know all, see all, change all

# Usage Consideration
* when page expects a name-value pair and in is not include in the response then the page should ignore 
* page may want to include 
* Page needs to handle the name-value pairs returned
* Unhandled name-value pairs should not cause a warning or exception

# Delete
* Delete Name-Value pair
  * with token, owner, id
  * token is AdminToken

# Get
* List of all page names
    * by AdminToken

* List of a page's Name-Value pairs
    * AdminToken
    * by GuestToken
    * by UserToken

# Post
* Create Name-Value pair
  * with token, owner, form
  * form is ????
  * token is AdminToken

# Put
* Change Value of Name-Value pair
  * with token, owner, id, form
  * token is AdminToken



# Data

pk: page#\<pageName>

sk: const#TITLE | const#SUBTITLE | const#DESCRIPTION | const#\<itemName>

tk:   

form:
    id:
    name:
    value: 
    
active: true  
created: 
updated: 
owner: 

# Tests
folder: api-get/generate-tess.js
tests require expected response
