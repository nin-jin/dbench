# dbench
Databases benchmark on NodeJS

## Databases

**mongodb-3.0.6** - enabled journaling, minimized sync frequency.

**nodejs-memory** - pojo in memory.

**orientdb-2.1.2-document** - used document api. 

**postgresql-9.4.4** - added index on "parent" field.

## Tests

**create-comment-tree** - creates comment tree with scheme:

```json
Comment
	message : string
	parent : &Comment
	child : list &Comment
```

Each of 10 roots have 1000 linear comment threads (10 depth) - 100K nodes.

**select-child-messages** - selects message values from root childs. 

## Results

Lower is better

```
db                       create-comment-tree  select-child-messages
-----------------------  -------------------  ---------------------
mongodb-3.0.6            270928               93
nodejs-memory            76                   0
orientdb-2.1.2-document  143513               32
postgresql-9.4.4         153380               10
```
