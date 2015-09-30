module.exports = {
	depends : [ 'create-comment-tree' ],
	run : function( db , result ) {
		var comments = db.selectChildMessages( result[ 'create-comment-tree' ][0] )
		return [ comments.length , comments.pop() ]
	}
}
