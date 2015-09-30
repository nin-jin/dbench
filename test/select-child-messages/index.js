module.exports = {
	depends : [ 'create-comment-tree' ],
	run : function( db , result ) {
		var messages = db.selectChildMessages( result[ 'create-comment-tree' ][0] )
		return [ messages.length , messages.pop() ]
	}
}
