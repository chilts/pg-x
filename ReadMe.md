# pg-x #

Robust helpers for [pg](https://www.npmjs.com/package/pg).

[![Build Status](https://travis-ci.org/chilts/pg-x.svg?branch=master)](https://travis-ci.org/chilts/pg-x) [![NPM](https://nodei.co/npm/pg-x.png?mini=true)](https://nodei.co/npm/pg-x/)

## Synopsis ##

Using pg's in-built `pool`:

```
const pool = new pg.Pool({
  connectionString  : 'postgres://pgx@localhost/pgx',
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

```
const pool = new pg.Pool({
  connectionString  : 'postgres://pgx@localhost/pgx',
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

## Author ##

Written by [Andrew Chilton](https://chilts.me/):

* [Blog](https://chilts.org/)
* [Twitter](https://twitter.com/andychilton)
* [GitHub](https://github.com/chilts)
* [Instagram](http://instagram.com/thechilts)

# License #

ISC

(Ends)
