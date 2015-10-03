# dbench
Databases benchmark on [NodeJS](https://nodejs.org/) + [Docker](https://docs.docker.com/)

## Start Up

* [Install Docker](https://docs.docker.com/installation/)

* Checkout this repo

```sh
git clone https://github.com/nin-jin/dbench
cd dbench
```

* Run

```sh
sh start.cmd
```

## Databases

**[mongo](https://www.mongodb.org/)** - enabled journaling, minimized sync frequency, transactions not supported

disk usage: 288MB

**[node-mem](https://nodejs.org/)** - pojo in memory.

disk usage: 0

**[orient-doc-mem](http://orientdb.com/)** - used [document api](http://orientdb.com/docs/2.1/Choosing-between-Graph-or-Document-API.html#document-api), in memory. 

disk usage: 0

**[orient-doc](http://orientdb.com/)** - used [document api](http://orientdb.com/docs/2.1/Choosing-between-Graph-or-Document-API.html#document-api). 

disk usage: 105MB

**[orient-graph](http://orientdb.com/)** - used [graph api](http://orientdb.com/docs/2.1/Choosing-between-Graph-or-Document-API.html#graph-api). 

disk usage: 125MB

**[postgres](http://www.postgresql.org/)** - no "child" field , added index on "parent" field and "position" field to store childs order.

disk usage: 23MB

## Tests

**[create-comment-tree](./test/create-comment-tree.js)** - creates comment tree with scheme:

```json
Comment has
	message is string
	parent is link to Comment
	child is list of link to Comment
```

Each of 100 roots have 100 linear comment threads (10 depth) - 100K nodes.

**[select-child-messages](./test/select-child-messages.js)** - selects message values from root childs.

**[select-messages-greater](./test/select-messages-greater.js)** - limited select and order by index.

## Results

Lower is better in all tables

#### Code complexity

```
db               create-comment-tree  select-child-messages  select-messages-greater
---------------  -------------------  ---------------------  -----------------------
mongo            high                 high                   high
node             low                  low                    ---
orient-doc       high                 low                    high
orient-graph     high                 low                    high
postgres         high                 high                   high
```

### System 1: windows without virtualization

```
CPU: i7-2640M@2.8GHz
OS: Windows 10
Java: 1.8.0_60
MongoDB: 3.0.6
NodeJS: 3.3.1
OrientDB: 2.1.2
PostgreSQL: 9.4.4
```

#### Config 1: 100 fibers * 100 branches * 10 depth = 100K records

```
db              create-comment-tree  select-child-messages  select-messages-greater
--------------  -------------------  ---------------------  -----------------------
mongo           395776               1142                   479
node-mem        86                   8                      5
orient-doc-mem  199459               771                    1032
orient-doc      224250               784                    1044
orient-graph    448189               1399                   885
postgres        233627               301                    296
```

#### Config 2: 10 fibers * 100 branches * 10 depth = 10K records

```
db               create-comment-tree  select-child-messages  select-messages-greater
---------------  -------------------  ---------------------  -----------------------
mongo            25102                53                     20
node-memory      5                    1                      0
orient-document  13857                47                     67
postgres         7898                 20                     18
```

#### Config 3: 100 fibers * 100 branches * 1 depth = 10K records

```
db               create-comment-tree  select-child-messages  select-messages-greater
---------------  -------------------  ---------------------  -----------------------
mongo            25214                629                    263
node-memory      15                   7                      3
orient-document  12622                445                    613
postgres         9060                 129                    141
```

#### Config 4: 100 fibers * 10 branches * 10 depth = 10K records

```
db               create-comment-tree  select-child-messages  select-messages-greater
---------------  -------------------  ---------------------  -----------------------
mongo            28647                248                    232
node-memory      19                   6                      5
orient-document  17568                149                    740
postgres         9599                 146                    184
```

