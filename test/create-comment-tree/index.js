var $jin = require( 'pms' ).$jin
module.exports = {
	run : $jin.async2sync( function( db , result , done ) {
		var results = []
		var wait = 0
		for( var i = 0 ; i < 100 ; ++i ) {
			++wait
			this.runOne( db , function( err , res ) {
				if( err ) done( err , res )
				results.push( res )
				if( --wait ) return
				done( null , results )
			})
		}
	} ),
	runOne : $jin.sync2async( function( db ) {
		var comments = []
		var count = 1000
		var deep = 10 //Math.round( Math.sqrt( count ) )
		for( var i = 0; i < count; ++i ) {
			var comment = db.insertComment( "Hello " + i , comments[ comments.length - 1 ] )
			comments.push( comment )
			if( comments.length > deep ) {
				comments.length = 1
			}
		}
		return [ comments[0] , comment ]
	} )
}
