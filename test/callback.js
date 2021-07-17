// --------------------------------------------------------------------------------------------------------------------

// npm
const pg = require('pg')
const test = require('tape')

// local
const util = require('./util.js')
const pgx = require('..')

// --------------------------------------------------------------------------------------------------------------------
// setup

const pool = new pg.Pool({
  connectionString  : process.env.DATABASE_URL || 'postgres://pgx@localhost/pgx',
  idleTimeoutMillis : 1000,
})

// --------------------------------------------------------------------------------------------------------------------
// tests

test('callback - test query() - DELETE ALL', (t) => {
  t.plan(2)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = 'DELETE FROM kv'
  pgx.query(pool, query, (err, rows, result) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows')

    t.end()
  })
})

test('callback - test query() - INSERT', (t) => {
  t.plan(3)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = {
    text   : 'INSERT INTO kv(key, val) VALUES($1, $2)',
    values : [ 'x', '2' ],
  }
  pgx.query(pool, query, (err, rows, result) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows')
    t.equal(result.rowCount, 1, 'One row was affected')

    t.end()
  })
})

test('callback - test query() - DELETE', (t) => {
  t.plan(3)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = "DELETE FROM kv WHERE key = 'x'"
  pgx.query(pool, query, (err, rows, result) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows')
    t.equal(result.rowCount, 1, 'One row was affected')

    t.end()
  })
})

test('callback - test one()', (t) => {
  t.plan(2)

  pgx.one(pool, 'SELECT 1 AS a', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { a : 1 }, 'Row was returned okay')

    t.end()
  })
})

test('callback - test one count()', (t) => {
  t.plan(2)

  pgx.one(pool, 'SELECT count(*) AS count FROM kv', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { count : '0' }, 'Row was returned okay')

    t.end()
  })
})

test('callback - test all()', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows yet')

    t.end()
  })
})

test('callback - test ins()', (t) => {
  t.plan(1)

  const obj = {
    key : 'name',
    val : 'Vic',
  }
  pgx.ins(pool, 'kv', obj, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test all(), now one row', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [{ key : 'name', val : 'Vic' }], 'One row!')

    t.end()
  })
})

test('callback - test one() for a specific row using query params', (t) => {
  t.plan(2)

  const query = {
    text : 'SELECT * FROM kv WHERE key = $1',
    values : [ 'name' ],
  }
  pgx.one(pool, query, (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { key : 'name', val : 'Vic' }, 'Got the row back')

    t.end()
  })
})

test('callback - test one() for a non-existing row using query params', (t) => {
  t.plan(2)

  const query = {
    text : 'SELECT * FROM kv WHERE key = $1',
    values : [ 'does not exist' ],
  }
  pgx.one(pool, query, (err, row) => {
    t.ok(!err, 'no error')
    t.ok(!row, 'No row for this name')

    t.end()
  })
})

test('callback - test get()', (t) => {
  t.plan(2)

  pgx.get(pool, 'kv', 'key', 'name', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, { key : 'name', val : 'Vic' }, 'Row was returned okay')

    t.end()
  })
})

test('callback - test get() - missing', (t) => {
  t.plan(2)

  pgx.get(pool, 'kv', 'key', 'does-not-exist', (err, row) => {
    t.ok(!err, 'no error')
    t.deepEqual(row, null, 'Row returned as null')

    t.end()
  })
})

test('callback - test another ins()', (t) => {
  t.plan(1)

  const obj = {
    key : 'name2',
    val : 'Bob',
  }
  pgx.ins(pool, 'kv', obj, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test all(), now two rows', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv ORDER BY key', (err, rows) => {
    t.ok(!err, 'no error')
    rows.sort(util.sortBy('key'))
    t.deepEqual(rows, [{ key : 'name', val : 'Vic' }, { key : 'name2', val : 'Bob' }], 'Two rows!')

    t.end()
  })
})

test('callback - test upd()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Bob',
  }
  pgx.upd(pool, 'kv', 'key', 'name', obj, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test all(), now two rows', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv ORDER BY key', (err, rows) => {
    t.ok(!err, 'no error')
    rows.sort(util.sortBy('key'))
    t.deepEqual(rows, [{ key : 'name', val : 'Bob' }, { key : 'name2', val : 'Bob' }], 'Two rows!')

    t.end()
  })
})

test('callback - test sel(), got both rows', (t) => {
  t.plan(2)

  pgx.sel(pool, 'kv', 'val', 'Bob', (err, rows) => {
    t.ok(!err, 'no error')
    rows.sort(util.sortBy('key'))
    t.deepEqual(rows, [{ key : 'name', val : 'Bob' }, { key : 'name2', val : 'Bob' }], 'Two rows!')

    t.end()
  })
})

test('callback - test upd()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Jane',
  }
  pgx.upd(pool, 'kv', 'key', 'name', obj, (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test sel() again, got just one row now', (t) => {
  t.plan(2)

  pgx.sel(pool, 'kv', 'val', 'Bob', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [{ key : 'name2', val : 'Bob' }], 'Row name2/Bob')

    t.end()
  })
})

test('callback - test del()', (t) => {
  t.plan(1)

  pgx.del(pool, 'kv', 'key', 'name', (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test del() again', (t) => {
  t.plan(1)

  pgx.del(pool, 'kv', 'key', 'name2', (err) => {
    t.ok(!err, 'no error')
    t.end()
  })
})

test('callback - test all(), zero rows again', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv', (err, rows) => {
    t.ok(!err, 'no error')
    t.deepEqual(rows, [], 'No rows')

    t.end()
  })
})

// --------------------------------------------------------------------------------------------------------------------
// client

test('callback - test using a client', (t) => {
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
// errors

test('callback - error query() - DELETE', (t) => {
  t.plan(5)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = "DELETE FROM nonexistent"
  pgx.query(pool, query, (err, rows, result) => {
    t.ok(Boolean(err), 'got an error')
    t.equal(err.severity, 'ERROR', 'got an expected severity')
    t.equal(err.code, '42P01', 'got an expected error')

    t.ok(!rows, 'No rows returned, not even an empty array')
    t.ok(!result, 'No result returned')

    t.end()
  })
})

// --------------------------------------------------------------------------------------------------------------------
