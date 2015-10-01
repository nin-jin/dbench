# dbench
Databases benchmark on NodeJS + Docker

## Start Up

1. [install docker](https://docs.docker.com/installation/)

2. checkout this repo

```sh
git clone https://github.com/nin-jin/dbench
cd dbench
```

3. run

```sh
sh start.cmd
```

## Databases

**mongodb-3.0.6** - enabled journaling, minimized sync frequency.

disk usage: 288MB

**nodejs-memory** - pojo in memory.

disk usage: 0

**orientdb-2.1.2-document** - used document api. 

disk usage: 105MB

**postgresql-9.4.4** - no "child" field , added index on "parent" field.

disk usage: 23MB

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
mongodb-3.0.6            204861               495                    306
nodejs-memory            106                  8                      5
orientdb-2.1.2-document  141268               294                    458
postgresql-9.4.4         136569               250                    261
```
