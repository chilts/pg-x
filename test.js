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

test('test one()', (t) => {
  t.plan(2)

  pgx.one(pool, 'SELECT 1 AS a', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { a : 1 }, 'Row was returned okay')

    t.end()
  })
})

test('test all()', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows yet')

    t.end()
  })
})

// --------------------------------------------------------------------------------------------------------------------
