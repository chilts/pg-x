# pg-x #

Robust helpers for [pg](https://www.npmjs.com/package/pg).

[![Build Status](https://travis-ci.org/chilts/pg-x.svg?branch=master)](https://travis-ci.org/chilts/pg-x) [![NPM](https://nodei.co/npm/pg-x.png?mini=true)](https://nodei.co/npm/pg-x/)

## Synopsis ##

Using pg's in-built `pool`:

```js
const pool = new pg.Pool({
  connectionString : 'postgres://pgx@localhost/pgx',
})
```

Then see each example below for each operation.

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

    console.log(Row:', row || 'none')
  })
})
```

## API ##

Note: `poc` means "pool or client" which is either a `pg.pool` or a `pg.client`.

### .query(poc, query, callback) ###

Just pass it a query much as you would straight to a `pg.pool` or a `pg.client`. The `rows` is equivalent to
`result.rows` and `result` is exacty what is given back to us by `pg`.

It is just a convenience function around the `pool.query()` and `client.query()` functions to also get the `rows` out
in one call. That's all. Perhaps this is better named just `.query()` to reflect the `pool.query()` or `client.query()`
in `pg`.

```js
// query
const insBlah = 'INSERT INTO blah(name) VALUES($1)'
const query = {
  text : insBlah,
  values : [ 'John Doe' ],
}
pgx.query(pool, query, (err, rows, result) => {
  if (err) throw err

  console.log(`${result.rowCount} rows were affected`)
})
```

### .one(poc, query, callback) ###

Get one row from the results (or null if there are no rows returned).

Example:

```js
// one
const selCount = 'SELECT count(*) AS count FROM tablename'
pgx.one(pool, selCount, (err, row) => {
  if (err) throw err
  console.log(Found row:', row || 'none')
})
```

### `.sel(poc, table, col, val, callback)` ###

Get all matching rows from a table where col = val (or `[]` if nothing matches).

Example:

```js
// sel
pgx.sel(pool, 'blog', 'account_id', 23, (err, rows) => {
  if (err) throw err

  // `rows` is always an array - but empty if there are no matching rows
  // It is never `null` or `undefined` unless there was an `err`.
  console.log(`There are ${rows.length} rows`)
})
```

### `.all(poc, query, callback)` ###

Get all rows from a table (or `[]` if nothing matches).

Example with direct SQL:

```js
// all
const selAll = 'SELECT * FROM tablename'
pgx.all(pool, selAll, (err, rows) => {
  if (err) throw err

  // `rows` is always an array - but empty if there are no matching rows
  // It is never `null` or `undefined` unless there was an `err`.
  console.log(`There are ${rows.length} rows`)
  console.log(rows)
})
```

Example using a query:

```js
// all
const query = {
  text : 'SELECT * FROM tablename WHERE col = $1',
  values : [ 'bob' ],
}
pgx.all(pool, query, (err, rows) => {
  if (err) throw err

  // `rows` is always an array - but empty if there are no matching rows
  // It is never `null` or `undefined` unless there was an `err`.
  console.log(rows)
})
```

### `.get(poc, table, col, val, callback)` ###

Gets one row from the table specified, or null if it doesn't exist.

Example, fetching a `user` called `bob`:

```js
pgx.get(pool, 'user', 'username', 'bob', (err, row) => {
  if (err) throw err

  // here, `row` is either `null` or an object with the cols/values
  if ( !row ) {
    console.log('No user found')
    return
  }

  // yes, the user exists
  console.log('User:', row)
})
```

Using `.get()` is equivalent to using `.one()` with the following query:

```js
// using `.get()`
pgx.get(pool, 'user', 'username', 'bob', console.log)

// using `.one()`
const query = {
  text: 'SELECT * FROM user WHERE username = $1',
  values: [ 'bob' ],
}
pgx.one(pool, query, console.log)
```

### `.ins(poc, table, obj, callback)` ###

Inserts a row into the table, using the key/value pairs in the obj. Returns the same `rows` and `results` as `.query()` above.

```js
const user = {
  username : 'chilts',
  email : 'chilts@example.com',
  website : 'https://chilts.org',
}
pgx.ins(client, 'account', user, (err, rows, result) => {
  // ...
})
```

### `.upd(poc, tablename, col, val, obj, callback)` ###

Updates one or more rows using the col/val pairs in `obj` and using `WHERE col = val`.

```js
const newDetails = {
  email : 'chilts@example.net',
}
pgx.upd(client, 'account', 'username', 'chilts', newDetails, (err, rows, result) => {
  // ...
})
```

### `.del(poc, tablename, col, val, callback)` ###

Deletes one or more rows using the col/val pairs in `obj` and using `WHERE col = val`.
you don't delete ALL rows.

```js
pgx.del(client, 'account', 'username', 'chilts', (err, rows, result) => {
  // ...
})
```

## Author ##

Written by [Andrew Chilton](https://chilts.me/):

* [Blog](https://chilts.org/)
* [Twitter](https://twitter.com/andychilton)
* [GitHub](https://github.com/chilts)
* [Instagram](http://instagram.com/thechilts)

# License #

ISC

(Ends)
