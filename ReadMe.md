# pg-x #

Robust helpers for [pg](https://www.npmjs.com/package/pg).

[![Build Status](https://travis-ci.org/chilts/pg-x.svg?branch=master)](https://travis-ci.org/chilts/pg-x)

## Synopsis ##

Using pg's in-built `pool`:

```
const pool = new pg.Pool({
  connectionString  : 'postgres://pgx@localhost/pgx',
})

pgx.getOne(pool, 'SELECT count(*) AS count FROM tablename', (err, row) => {
  console.log(`There are ${row.count} rows`)
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
