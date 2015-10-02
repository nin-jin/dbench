module.exports = {
	depends : [ 'create-comment-tree' ],
	run : function( db , thread , result ) {
		var messages = db.selectMessagesGreater( 'Hello ' + thread )
		return [ messages.length , messages.pop() ]
	}
}
