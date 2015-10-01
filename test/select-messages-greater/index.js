var $jin = require( 'pms' ).$jin

module.exports = {
	depends : [ 'create-comment-tree' ],
	run : $jin.async2sync( function( db , result , done ) {
		var results = []
		var wait = 0
		for( var i = 0 ; i < 100 ; ++i ) {
			++wait
			this.runOne( db , 'Hello ' + i , function( err , res ) {
				if( err ) done( err , res )
				results.push( res )
				if( --wait ) return
				done( null , results )
			})
		}
	} ),
	runOne : $jin.sync2async( function( db , val ) {
		var messages = db.selectMessagesGreater( val )
		return [ messages.length , messages.pop() ]
	} )
}
