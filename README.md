# dbench
Databases benchmark on NodeJS

## Databases

**mongodb-3.0.6** - enabled journaling, minimized sync frequency

**orientdb-2.1.2-document** - used document api 

## Tests

**create-comment-tree** - creates comment tree with scheme:

```json
Comment
	message : string
	parent : &Comment
	child : list &Comment
```

Root have 1000 linear comment threads (10 depth)

**select-child-messages** - selects message values from root childs 

## Results

Lower is better

```
db                       create-comment-tree  select-child-messages
-----------------------  -------------------  ---------------------
mongodb-3.0.6            28129                59
nodejs-memory            6                    0
orientdb-2.1.2-document  15418                26
```
