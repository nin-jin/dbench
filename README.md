# dbench
Databases benchmark on [NodeJS](https://nodejs.org/) + [Docker](https://docs.docker.com/)

## Start Up

1. [Install Docker](https://docs.docker.com/installation/)

2. Checkout this repo

```sh
git clone https://github.com/nin-jin/dbench
cd dbench
```

3. Run

```sh
sh start.cmd
```

## Databases

**[mongodb-3.0.6](https://www.mongodb.org/)** - enabled journaling, minimized sync frequency.

disk usage: 288MB

**[nodejs-memory](https://nodejs.org/)** - pojo in memory.

disk usage: 0

**[orientdb-2.1.2-document](http://orientdb.com/)** - used document api. 

disk usage: 105MB

**[postgresql-9.4.4](http://www.postgresql.org/)** - no "child" field , added index on "parent" field.

disk usage: 23MB

## Tests

**[create-comment-tree](./test/create-comment-tree/index.js)** - creates comment tree with scheme:

```json
Comment has
	message is string
	parent is link to Comment
	child is list of link to Comment
```

Each of 100 roots have 100 linear comment threads (10 depth) - 100K nodes.

**[select-child-messages](./test/select-child-messages/index.js)** - selects message values from root childs.

**[select-messages-greater](./test/select-messages-greater/index.js)** - limited select and order by index.

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
