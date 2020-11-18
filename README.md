# dbench

Databases benchmark on [NodeJS](https://nodejs.org/)

## Databases

**[orient](./db/orient.js)** - [OrientDB](http://orientdb.com/) with document api. 

**[postgres](./db/postgres.js)** - [PostgreSQL](http://www.postgresql.org/) with ltree.

## Tests

**[create_comment_tree](./test/create_comment_tree.js)** - creates comment tree with scheme:

```json
Comment has
	message is string
	parent is link to Comment
	child is list of link to Comment
```

Each of 100 roots have 10 linear comment threads (100 depth) - 100K comments.

**[select_child_messages](./test/select_child_messages.js)** - selects message values from root comments.

**[select_descendant_messages](./test/select_descendant_messages.js)** - selects message values from root comments and its subtree.

**[select_messages_greater](./test/select_messages_greater.js)** - limited select by text index and order by it.

## Results

### Performance

```
CPU: i7-6500M@2.5GHz
OS: Windows 10
Java: 1.8.0_271
NodeJS: 14.12.0
OrientDB: 3.1.4
PostgreSQL: 13.0
```

```
config  {
  db: { postgres: {}, orient: {} },
  test: [
    'create_comment_tree',
    'select_child_messages',
    'select_descendant_messages',
    'select_messages_greater'
  ],
  thread: { count: 100 },
  comment: { branch: { count: 10, depth: 100 } }
}

db        create_comment_tree  select_child_messages  select_descendant_messages  select_messages_greater
--------  -------------------  ---------------------  --------------------------  -----------------------
postgres  63646                53                     3168                        1452
orient    90688                78                     3969                        2821
```

Lower is better in all tables
