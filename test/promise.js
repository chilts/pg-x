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

test('promise - test query() - INSERT', (t) => {
  t.plan(2)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = {
    text   : 'INSERT INTO kv(key, val) VALUES($1, $2)',
    values : [ 'x', '2' ],
  }
  pgx.query(pool, query)
    .then(({ rows, result }) => {
      t.deepEqual(rows, [], 'No rows')
      t.equal(result.rowCount, 1, 'One row was affected')
      t.end()
    })
    .catch(err => {
      console.warn(err)
      t.fail("Shouldn't have received an error!")
    })
})

test('promise - test query() - DELETE', (t) => {
  t.plan(2)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = "DELETE FROM kv WHERE key = 'x'"
  pgx.query(pool, query)
    .then(({ rows, result }) => {
      t.deepEqual(rows, [], 'No rows')
      t.equal(result.rowCount, 1, 'One row was affected')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have received an error!")
    })
})

test('promise - test one()', (t) => {
  t.plan(1)

  pgx.one(pool, 'SELECT 1 AS a')
    .then(({ row }) => {
      t.deepEqual(row, { a : 1 }, 'Row was returned okay')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have received an error!")
    })
})

test('promise - test one count()', (t) => {
  t.plan(1)

  pgx.one(pool, 'SELECT count(*) AS count FROM kv')
    .then(({ row }) => {
      t.deepEqual(row, { count : '0' }, 'Row was returned okay')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have received an error!")
    })
})

test('promise - test all()', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      t.deepEqual(rows, [], 'No rows yet')

      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test ins()', (t) => {
  t.plan(1)

  const obj = {
    key : 'name',
    val : 'Vic',
  }
  pgx.ins(pool, 'kv', obj)
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test all(), now one row', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      t.deepEqual(rows, [{ key : 'name', val : 'Vic' }], 'One row!')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test one() for a specific row using query params', (t) => {
  t.plan(2)

  const query = {
    text : 'SELECT * FROM kv WHERE key = $1',
    values : [ 'name' ],
  }
  pgx.one(pool, query)
    .then(({ err, row }) => {
      t.ok(!err, 'no error')
      t.deepEqual(row, { key : 'name', val : 'Vic' }, 'Got the row back')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test one() for a non-existing row using query params', (t) => {
  t.plan(2)

  const query = {
    text : 'SELECT * FROM kv WHERE key = $1',
    values : [ 'does not exist' ],
  }
  pgx.one(pool, query)
    .then(({ err, row }) => {
      t.ok(!err, 'no error')
      t.ok(!row, 'No row for this name')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test get()', (t) => {
  t.plan(2)

  pgx.get(pool, 'kv', 'key', 'name')
    .then(({ err, row }) => {
      t.ok(!err, 'no error')
      t.deepEqual(row, { key : 'name', val : 'Vic' }, 'Row was returned okay')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test get() - missing', (t) => {
  t.plan(2)

  pgx.get(pool, 'kv', 'key', 'does-not-exist')
    .then(({ err, row }) => {
      t.ok(!err, 'no error')
      t.deepEqual(row, null, 'Row returned as null')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test another ins()', (t) => {
  t.plan(1)

  const obj = {
    key : 'name2',
    val : 'Bob',
  }
  pgx.ins(pool, 'kv', obj)
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test all(), now two rows', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv ORDER BY key')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      rows.sort(util.sortBy('key'))
      t.deepEqual(rows, [{ key : 'name', val : 'Vic' }, { key : 'name2', val : 'Bob' }], 'Two rows!')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test upd()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Bob',
  }
  pgx.upd(pool, 'kv', 'key', 'name', obj)
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test all(), now two rows', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv ORDER BY key')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      rows.sort(util.sortBy('key'))
      t.deepEqual(rows, [{ key : 'name', val : 'Bob' }, { key : 'name2', val : 'Bob' }], 'Two rows!')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test sel(), got both rows', (t) => {
  t.plan(2)

  pgx.sel(pool, 'kv', 'val', 'Bob')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      rows.sort(util.sortBy('key'))
      t.deepEqual(rows, [{ key : 'name', val : 'Bob' }, { key : 'name2', val : 'Bob' }], 'Two rows!')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test upd()', (t) => {
  t.plan(1)

  const obj = {
    val : 'Jane',
  }
  pgx.upd(pool, 'kv', 'key', 'name', obj)
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test sel() again, got just one row now', (t) => {
  t.plan(2)

  pgx.sel(pool, 'kv', 'val', 'Bob')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      t.deepEqual(rows, [{ key : 'name2', val : 'Bob' }], 'Row name2/Bob')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test del()', (t) => {
  t.plan(1)

  pgx.del(pool, 'kv', 'key', 'name')
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test del() again', (t) => {
  t.plan(1)

  pgx.del(pool, 'kv', 'key', 'name2')
    .then(({ err }) => {
      t.ok(!err, 'no error')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

test('promise - test all(), zero rows again', (t) => {
  t.plan(2)

  pgx.all(pool, 'SELECT * FROM kv')
    .then(({ err, rows }) => {
      t.ok(!err, 'no error')
      t.deepEqual(rows, [], 'No rows')
      t.end()
    })
    .catch(err => {
      t.fail("Shouldn't have been an error")
    })
})

// --------------------------------------------------------------------------------------------------------------------
// client

test('promise - test using a client', (t) => {
  t.plan(3)

  pool.connect((err, client, done) => {
    t.ok(!err, 'no error when connecting')

    pgx.one(client, 'SELECT 1 AS a')
      .then(({ row, result }) => {
        t.deepEqual(row, { a : 1 }, 'Row was returned okay')
      })
      .catch(err => {
        t.fail("Shouldn't have received an error")
      })
      .finally(() => {
        t.ok('Got into the .finally()')
        done()
      })
  })
})

// --------------------------------------------------------------------------------------------------------------------
// errors

test('promise - error query() - DELETE', (t) => {
  t.plan(1)

  // See : https://node-postgres.com/features/queries#query-config-object
  const query = "DELETE FROM nonexistent"
  pgx.query(pool, query)
    .then((rows, result) => {
      t.fail("Should not have succeeded")
    })
    .catch(err => {
      t.ok(Boolean(err), 'got an error as expected')
      t.end()
    })
})

// --------------------------------------------------------------------------------------------------------------------
