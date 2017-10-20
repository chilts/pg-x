// --------------------------------------------------------------------------------------------------------------------

// npm
const pg = require('pg')
const test = require('tape')

// local
const pgx = require('.')

// --------------------------------------------------------------------------------------------------------------------
// setup

const pool = new pg.Pool({
  connectionString  : process.env.DATABASE_URL || 'postgres://pgx@localhost/pgx',
  idleTimeoutMillis : 1000,
})

// --------------------------------------------------------------------------------------------------------------------

test('test getOne()', (t) => {
  t.plan(2)

  pgx.getOne(pool, 'SELECT 1 AS a', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { a : 1 }, 'Row was returned okay')

    t.end()
  })
})

// --------------------------------------------------------------------------------------------------------------------
