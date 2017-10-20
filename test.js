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
// pool

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

test('test ins()', (t) => {
  t.plan(1)

  const obj = {
    key : 'name',
    val : 'Vic',
  }
  pgx.ins(pool, 'kv', { key : 'name', val : 'Vic' }, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('test all(), now one row', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [{ key : 'name', val : 'Vic' }], 'One row!')

    t.end()
  })
})

test('test upd()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Bob',
  }
  pgx.upd(pool, 'kv', 'key', 'name', obj, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('test all(), still one row', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [{ key : 'name', val : 'Bob' }], 'One row!')

    t.end()
  })
})

test('test del()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Bob',
  }
  pgx.del(pool, 'kv', 'key', 'name', (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('test all(), zero rows again', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows')

    t.end()
  })
})

// --------------------------------------------------------------------------------------------------------------------
// client

test('test using a client', (t) => {
  t.plan(3)

  pool.connect((err, client, done) => {
    t.ok(!err, 'no error when connecting')

    pgx.one(client, 'SELECT 1 AS a', (err, row) => {
      done()
      t.ok(!err, 'no error when calling .one()')
      t.deepEqual(row, { a : 1 }, 'Row was returned okay')

      t.end()
    })
  })
})


// --------------------------------------------------------------------------------------------------------------------
