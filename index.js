// --------------------------------------------------------------------------------------------------------------------

function getOne(poolOrClient, query, callback) {
  if ( !poolOrClient ) {
    throw new Error('pg-x.getOne() - first arg must be pg.pool or pg.client')
  }

  // change the query from text to an object
  // if ( typeof query === 'string' ) {
  //   query = {
  //     text : query,
  //   }
  // }

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

// --------------------------------------------------------------------------------------------------------------------

module.exports = {
  getOne,
}

// --------------------------------------------------------------------------------------------------------------------
