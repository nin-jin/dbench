module.exports = {
	depends : [ 'create-comment-tree' ],
	run : function( db , thread , result ) {
		var messages = db.selectChildMessages( result[ 'create-comment-tree' ][ thread ][0] )
		return [ messages.length , messages.pop() ]
	}
}
