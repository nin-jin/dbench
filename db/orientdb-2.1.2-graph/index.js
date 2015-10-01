var await = require( 'pms' ).$jin.async2sync( function( promise , done ) {
	promise.then( function( result ) { done( null , result ) } , done )
} )

var db
module.exports = {
	init : function( ) {
		db = require( 'orientjs' )({
			host: 'localhost',
			port: 2424,
			username: 'root',
			password: 'root'
		}).use( 'dbench-graph' )
		
		await( db.query( 'drop index Comment.message' ) )
		await( db.query( 'drop class Comment unsafe' ) )
		
		await( db.query( 'create class Comment extends V' ) )
		await( db.query( 'create property Comment.message string' ) )
		await( db.query( 'create property Comment.parent link Comment' ) )
		await( db.query( 'create property Comment.child linklist Comment' ) )
		await( db.query( 'create index Comment.message notunique' ) )
	} ,
	insertComment : function( message , parent ) {
		var data = { message : message , parent : parent }
		
		var query = db.let( 'child', function( db ) {
			return db.query( 'create vertex Comment set message = :message , parent = :parent ' , { params : data } )
		} )
		if( parent ) {
			query = query.let( 'parent', 'update ' + parent + ' add child = $child' )
		}
		query.commit(100).return( '$child.@rid' )
		
		return await( query.one() )['@rid']
	} ,
	selectChildMessages : function( baseId ) {
		return await( db.select( 'child.message' ).from( baseId ).one() ).child
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