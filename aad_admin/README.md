# Documents
Goal:
Store/Administrate/Distribute a document from the database. 
Strategy:
* Keep an original human readable/editable document in the repository.  
* Have process/script to load original document into database during setup
* Have process/script to replace the document in the database during runtime

```
  [*]
   |
[Get List of Docunents]  
   |
(document[i]) <------------- +
   |                         |
[Breakdown Document]         |
   |                         |
(words)                      |
   |                         |
[Load Words] ---> (i++) ---> +
   |
   =

```
