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

**[mongo](https://www.mongodb.org/)** - enabled journaling, minimized sync frequency.

disk usage: 288MB

**[node-memory](https://nodejs.org/)** - pojo in memory.

disk usage: 0

**[orient-document](http://orientdb.com/)** - used document api. 

disk usage: 105MB

**[postgres](http://www.postgresql.org/)** - no "child" field , added index on "parent" field.

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

Lower is better (ms)

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
db               create-comment-tree  select-child-messages  select-messages-greater
---------------  -------------------  ---------------------  -----------------------
mongo            351163               581                    313
node-memory      80                   6                      6
orient-document  200550               584                    688
postgres         162923               280                    255
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

