# Document to Name-Value Pairs

Given a document "tou.md" containing the following paragraphs:

```
# Terms of Use
## Adopt a Drain Grand River
Website Terms of Use Agreement
## 1. Acceptance of Terms of Use
Grand Valley Metro Council (GVMC) and the sponsoring jurisdictions of
[[communities]]
provides the Adopt-a-Drain program ("AAD") to you subject to the following Terms of Use Agreement ("Agreement") which may be updated by us from time to time without notice to you. By accessing and using AAD, you accept and agree to be bound by the terms and provision of this Agreement.
```


Store "tou.md" As

```
{pk: "doc_id#tou.md", sk: "name#00000.00000", tk: "value#"}
{pk: "doc_id#tou.md", sk: "name#00000.00001", tk: "value#Terms"}
{pk: "doc_id#tou.md", sk: "name#00000.00002", tk: "value#of"}
{pk: "doc_id#tou.md", sk: "name#00000.00003", tk: "value#Use"}
{pk: "doc_id#tou.md", sk: "name#00001.00000", tk: "value###"}
{pk: "doc_id#tou.md", sk: "name#00001.00001", tk: "value#Adopt"}
{pk: "doc_id#tou.md", sk: "name#00001.00002", tk: "value#a"}
{pk: "doc_id#tou.md", sk: "name#00001.00003", tk: "value#Drain"}
{pk: "doc_id#tou.md", sk: "name#00001.00004", tk: "value#Grand"}
{pk: "doc_id#tou.md", sk: "name#00001.00005", tk: "value#River"}
{pk: "doc_id#tou.md", sk: "name#00002.00000", tk: "value#Website"}
{pk: "doc_id#tou.md", sk: "name#00002.00001", tk: "value#Terms"}
{pk: "doc_id#tou.md", sk: "name#00002.00002", tk: "value#of"}
{pk: "doc_id#tou.md", sk: "name#00002.00003", tk: "value#Use"}
{pk: "doc_id#tou.md", sk: "name#00002.00004", tk: "value#Agreement"}
{pk: "doc_id#tou.md", sk: "name#00003.00000", tk: "value#"}
```

Assemble "tou.md" into paragraphs

```javascript
// see above for full document
let doc = [
    {pk: "doc_id#tou.md", sk: "name#00000.00000", tk: "value#"},
    {pk: "doc_id#tou.md", sk: "name#00000.00001", tk: "value#Terms"},
    ...
];
let document = [];
let paragraph = '';
let firstParagraph = doc[0].value.split('.')[0]; // i.e. 'name#00000' 

for (item of doc) {
    
    if (item.sk.startsWith(firstParagraph)) {
        if (paragraph.length > 0) { paragraph += ' ';}
        
        paragraph += item.value.replace('value#', '');
    } else {
        docuement.push({id: 'id'});
        firstParagraph = doc[0].value.split('.')[0];
    }
     
}
```
Paragraph an ordered series of words
Paragraph is terminated by an EOL 