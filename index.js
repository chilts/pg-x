// --------------------------------------------------------------------------------------------------------------------

function one(poolOrClient, query, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.one() - first arg must be pg.pool or pg.client')
  }

  poolOrClient.query(query, (err, res) => {
    if (err) return callback(err)

    // if nothing there
    if ( res.rows.length === 0 ) {
      return callback(null, null)
    }

    // if we have more than one row, give a warning but return the first anyway
    if ( res.rows.length > 1 ) {
      console.warn("Query returned more than one row but expected only one : " + query.text)
    }

    callback(null, res.rows[0])
  })
}

function all(poolOrClient, query, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.all() - first arg must be pg.pool or pg.client')
  }

  poolOrClient.query(query, (err, res) => {
    if (err) return callback(err)

    // if nothing there
    if ( res.rows.length === 0 ) {
      return callback(null, [])
    }

    callback(null, res.rows)
  })
}

function ins(poolOrClient, tablename, obj, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.ins() - first arg must be pg.pool or pg.client')
  }

  // insert this row into this table
  const keys = Object.keys(obj)
  const sql = `INSERT INTO ${ tablename }(${ keys.join(', ') }) VALUES(${ keys.map((key, i) => '$' + (i+1)).join(', ') })`
  const query = {
    text   : sql,
    values : keys.map(key => obj[key]),
  }
  poolOrClient.query(query, callback)
}

function upd(poolOrClient, tablename, col, val, obj, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.upd() - first arg must be pg.pool or pg.client')
  }

  // update this row
  const keys = Object.keys(obj)
  const sql = `UPDATE ${ tablename } SET ${ keys.map((key, i) => `${key} = $${i+1}`) } WHERE ${ col } = $${ keys.length + 1}`
  const query = {
    text   : sql,
    values : keys.map(key => obj[key]).concat(val),
  }
  poolOrClient.query(query, callback)
}

function del(poolOrClient, tablename, col, val, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.del() - first arg must be pg.pool or pg.client')
  }

  // delete this row
  const sql = `DELETE FROM ${ tablename } WHERE ${ col } = $1`
  const query = {
    text   : sql,
    values : [ val ],
  }
  poolOrClient.query(query, callback)
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = {
  one,
  all,
  ins,
  upd,
  del,
}

// --------------------------------------------------------------------------------------------------------------------
