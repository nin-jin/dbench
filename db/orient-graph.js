var await = require( 'pms' ).$jin.async2sync( function( promise , done ) {
	promise.then( function( result ) { done( null , result ) } , done )
} )

var db
module.exports = {
	init : function( ) {
		var server = require( 'orientjs' )({
			host: 'dbench-orient',
			port: 2424,
			username: 'root',
			password: 'root'
		})
		
		try {
			db = await( server.create({	
				name :  'dbench-graph',
				type : 'graph',
				storage : 'plocal'
			}) )
		} catch( error ) {
			if( /^Database named 'dbench-graph' already exists/.test( error.message ) ) {
				db = server.use( 'dbench-graph' )
			} else {
				throw error
			}
		}
		
		await( db.query( 'drop index Comment.message' ) )
		await( db.query( 'drop class ReplyTo unsafe' ) )
		await( db.query( 'drop class Comment unsafe' ) )
		
		await( db.query( 'create class Comment extends V' ) )
		await( db.query( 'create property Comment.message string' ) )
		await( db.query( 'create index Comment.message notunique' ) )
		await( db.query( 'create class ReplyTo extends E' ) )
	} ,
	insertComment : function( message , parent ) {
		var data = { message : message , parent : parent }
		
		//await( db.vertex.create( 'Comment' ).set( data ).one() )
		
		var query = db.let( 'child', 'create vertex Comment content ' + JSON.stringify( data ) )
		if( parent ) {
			query = query.let( 'relation', 'create edge ReplyTo from $child to ' + parent )
		}
		query.commit(100).return( '$child.@rid' )
		
		return await( query.one() )['@rid']
	} ,
	selectChildMessages : function( baseId ) {
		return await( db.query( 'select in( ReplyTo ).message from ' + baseId ) )[0].in
	} ,
	selectMessagesGreater : function( val ) {
		var query = db.query(
			'select message from Comment where message > :val order by message limit 100' , 
			{
				params : { val : val }
			}
		)
		return await( query.all() ).map( function( doc ) {
			return doc.message
		} )
	} ,
	complete : function() {
		db.close()
		db = null
	}
}
