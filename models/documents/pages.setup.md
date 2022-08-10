
# Page
Setup document for page components.

## How this works...
* You maintain this markdown document. 
* The contents are parsed and converted to json.
* The json is written into the database.
* Your application reads the settings from the database and you code your application to use the values.

## When does this Document Get Processed?
* The db.deploy.js script gets called 
  * on _docker-compose up_
  * docker-compose exec db-api npm run db-deploy
  * on a _pull request_ in github (staging database)
  * on a _merge_ in github (production database)

## What Gets Read?
Name and Value Pairs.
The parser will search this document for name and value pairs.  
When found it will pluck them out and put them into the database.

The parsing script reads each line of this document looking for lines that start with:
    
    ##
    or
    <number>.  

    
Two patterms
```
Header
    ## <name>: <value>
    
Subheader        
    1. <name>: <value>
    ...
```
__Special Subheader__

_item_ is a specal name that designates an item in a list. 
```
 ## System: Sol
 
    1. item: Mercury
    2. item: Venus
    3. item: Earth
    4. item: Mars

```

Example
```
 ## Page: About

 1. id: about
 2. title: About
 3. subtitle: We-are-concerned-citizens
 4. item_title: Contributing-Organizations
 5. item: LGROW
 6. item: CitizenLabs

```
Goes to 
```
{"id": "about", "name": "id", "value": "about"},
{"id": "about", "name": "title", "value": "About"},
{"id": "about", "name": "subtitle", "value": "We-are-concerned-citizens"},
{"id": "about", "name": "item_title", "value": "Contributing-Organizations"},
{"id": "about", "name": "item0", "value": "LGROW"},
{"id": "about", "name": "item1", "value": "CitizenLabs"},

```
* notice: _page_ in _page_id_ is built from the Header \<name> 
* notice: an _item_ will get an incremented numeric suffix

## Name and Value Pairs
A name and value is a fundimental data structure. 
This document defines page settings using name and value pairs.
The name and value are seperated by a colon (eg name:value) 

General Rules:

* Edit this document in a text only editor
* The name and value pair pattern is \<name>:\<value>
* A \<name> cannot contain spaces. Use underscore instead
* A \<value> cannot contain spaces. Use hyphen instead
* A name and value pair is limited to a single line

Page Rules

* The id \<name> must be unique across all pages
* The id, title, subtitle, description and item_title \<name>s can only be used once per page.
* The item \<name> can be used more than once.

## Application Enabled Names:

The adopt-a-drain app (AAD) knows about name and value pairs.  
AAD looks for a specific set of \<name> and uses  

* id: \<value>
* title: \<value>
* subtitle: \<value>
* description: \<value>
* item_title: \<value>
* item: \<value>

# AAD Settings

## Page: About

1. id: about
2. title: About
3. subtitle: We-are-concerned-citizens
4. item_title: Contributing-Organizations
5. item: LGROW
6. item: CitizenLabs

## Page:  Opportunities

1. id: opportunities
2. title: Opportunities
3. subtitle: We-care-about-what-you-want-to-do.
4. description: Are-you-a-programmer-with-Nuxtjs-experience-who-wants-to-help-improve-and-maintain-the-Adopt-a-Drain-application?-Dont-be-shy!-We-are-always-seeking-assistance-with-the-code!-Get-involved-and-follow-our-GitHub-page.
5. item: Beginners-and-Experts 
6. item: Coders
7. item: Domain-Experts 
8. item: Designers
9. item: Developers 
10. item: Hackers
11. item: Speakers
12. item: Teachers
13. item: Testers
14. item: Writers

## Page: SignUp

1. id: adopter 
2. title: SignUp
3. subtitle: Because,-because,-because.
4. description: Getting to know you

## Page: Sponsors

1. id: sponsor
2. title: Sponsors
3. subtitle: We-cannot-do-this-alone.
4. description: Thank-You
5. item: Lower-Grand-River-Organization-of-Watersheds
6. item:CitizenLabs

## Page: Stats

1. id: stats
2. title: stats
3. subtitle: How-much-do-we-care?
4. description: Thank You
5. item: Drain-Adopters
6. item: Adopted-Drains

