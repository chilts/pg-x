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
  console.log(`There are ${row.count} rows`)
})

// all
const selAll = 'SELECT * FROM tablename'
pgx.all(pool, selAll, (err, rows) => {
  // if there is no error, rows is always [] or [ ... ]
  // (and never `null` or `undefined`).
  console.log(rows)
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
