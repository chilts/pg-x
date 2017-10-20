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

// --------------------------------------------------------------------------------------------------------------------

module.exports = {
  one,
  all,
}

// --------------------------------------------------------------------------------------------------------------------
