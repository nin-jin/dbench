module.exports = {

	depends : [ 'create_comment_tree' ],
	
	async run( db , thread , config, result ) {
		
		var root = result[ 'create_comment_tree' ][ thread ]
		const messages = await db.selectChildMessages( root )
		
		console.assert( messages.length === config.comment.branch.count )

		const prefix = 'Hello ' + thread + ' '
		for( const msg of messages ) {
			console.assert( msg.substring( 0, prefix.length ) === prefix )
		}
		
		return messages.length
	}

}
