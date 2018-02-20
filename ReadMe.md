# pg-x #

Robust helpers for [pg](https://www.npmjs.com/package/pg).

[![Build Status](https://travis-ci.org/chilts/pg-x.svg?branch=master)](https://travis-ci.org/chilts/pg-x) [![NPM](https://nodei.co/npm/pg-x.png?mini=true)](https://nodei.co/npm/pg-x/)

## Synopsis ##

Using pg's in-built `pool`:

```js
const pool = new pg.Pool({
  connectionString : 'postgres://pgx@localhost/pgx',
})

// exec
const insBlah = 'INSERT INTO blah(name) VALUES($1)'
const query = {
  text : insBlah,
  values : [ 'John Doe' ],
}
pgx.exec(pool, query, (err, rows, result) => {
  if (err) throw err

  console.log(`${result.rowCount} rows were affected`)
})

// one
const selCount = 'SELECT count(*) AS count FROM tablename'
pgx.one(pool, selCount, (err, row) => {
  if (err) throw err

  console.log(`There are ${row.count} rows`)
})

// all
const selAll = 'SELECT * FROM tablename'
pgx.all(pool, selAll, (err, rows) => {
  if (err) throw err

// if there is no error, rows is always [] or [ ... ]
  // (and never `null` or `undefined`).
  console.log(rows)
})
```

You can also pass a `pg.client` instead of a `pg.pool` to any method, since the only method we use is `.query()` and
both `pg.pool` and `pg.client` provide it.

```js
const pool = new pg.Pool({
  connectionString : 'postgres://pgx@localhost/pgx',
})

// callback - checkout a client
pool.connect((err, client, done) => {
  if (err) throw err

  // one
  const selCount = 'SELECT count(*) AS count FROM tablename'
  pgx.one(pool, selCount, (err, row) => {
    done()
    if (err) throw err

    console.log(`There are ${row.count} rows`)
  })
})
```

## API ##

Note: `poc` means "pool or client" which is either a `pg.pool` or a `pg.client`.

### .one(poc, query, callback) ###

Get one row from a table (or null if it doesn't exist).

### `.all(poc, query, callback)` ###

Get all rows from a table (or `[]` if nothing matches).

### `.get(poc, table, col, val, callback)` ###

Gets one row from the table specified, or null if it doesn't exist.

### `.ins(poc, table, obj, callback)` ###

Inserts a row into the table, using the key/value pairs in the obj.

### `.upd(poc, tablename, col, val, obj, callback)` ###

Updates one or more rows using the col/val pairs in `obj` and using `WHERE col = val`.

### `.del(poc, tablename, col, val, callback)` ###

Deletes one or more rows using the col/val pairs in `obj` and using `WHERE col = val`.

## Author ##

Written by [Andrew Chilton](https://chilts.me/):

* [Blog](https://chilts.org/)
* [Twitter](https://twitter.com/andychilton)
* [GitHub](https://github.com/chilts)
* [Instagram](http://instagram.com/thechilts)

# License #

ISC

(Ends)
