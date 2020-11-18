module.exports = {

	depends : [ 'create_comment_tree' ],
	
	async run( db , thread , config, result ) {
		
		const count = config.comment.branch.count * config.comment.branch.depth
		var root = result[ 'create_comment_tree' ][ thread ]
		const messages = await db.selectDescendantMessages( root )

		console.assert( messages.length === count, `selectDescendantMessages should return ${count} items, but ${ messages.length } received.` )

		const prefix = 'Hello ' + thread + ' '
		for( const msg of messages ) {
			console.assert( msg.substring( 0, prefix.length ) === prefix, `selectDescendantMessages should return items starts with ${prefix}` )
		}
		
		return messages.length
	}

}
