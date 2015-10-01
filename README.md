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
Comment has
	message is string
	parent is link to Comment
	child is list of link to Comment
```

Each of 100 roots have 100 linear comment threads (10 depth) - 100K nodes.

**select-child-messages** - selects message values from root childs.

**select-messages-greater** - limited select and order by index.

## Results

Lower is better

```
db                       create-comment-tree  select-child-messages  select-messages-greater
-----------------------  -------------------  ---------------------  -----------------------
mongodb-3.0.6            15720                186                    175
nodejs-memory            16                   5                      5
orientdb-2.1.2-document  11677                58                     399
postgresql-9.4.4         6164                 80                     160
```
