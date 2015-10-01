var $jin = require( 'pms' ).$jin

module.exports = {
	depends : [ 'create-comment-tree' ],
	run : $jin.async2sync( function( db , result , done ) {
		var roots = result[ 'create-comment-tree' ]
		var results = []
		var wait = 0
		for( var i = 0 ; i < roots.length ; ++i ) {
			++wait
			this.runOne(
				db ,
				roots[ i ][0] ,
				function( err , res ) {
					if( err ) done( err , res )
					results.push( res )
					if( --wait ) return
					done( null , results )
				}
			)
		}
	} ),
	runOne : $jin.sync2async( function( db , root ) {
		var messages = db.selectChildMessages( root )
		return [ messages.length , messages.pop() ]
	} )
}
