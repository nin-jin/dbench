module.exports = {

	depends : [ 'create_comment_tree' ],
	
	async run( db , thread , config, result ) {

		const limit = config.comment.branch.count * config.comment.branch.depth
		const messages = await db.selectMessagesGreater( 'Hello ' + thread + ' ', limit )
		console.assert( messages.length === limit )
		
		const prefix = 'Hello ' + thread + ' '
		for( const msg of messages ) {
			console.assert( msg.substring( 0, prefix.length ) === prefix )
		}
		
		return messages.length
	}

}
