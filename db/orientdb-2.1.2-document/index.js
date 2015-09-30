var await = require( 'pms' ).$jin.async2sync( function( promise , done ) {
	promise.then( function( result ) { done( null , result ) } , done )
} )

var db
module.exports = {
	init : function( ) {
		if( db ) db.close()
		db = require( 'orientjs' )({
			host: 'localhost',
			port: 2424,
			username: 'root',
			password: 'root'
		}).use( 'dbench' )
		
		await( db.class.drop( 'Comment' ) )
		var Comment = await( db.class.create( 'Comment' ) )
		
		await( Comment.property.create({
			name : 'message' ,
			type : 'string'
		}) )
		await( Comment.property.create({
			name : 'parent' , 
			type : 'link' , 
			linkedClass : 'Comment' 
		}) )
		await( Comment.property.create({
			name : 'child' , 
			type : 'linklist' , 
			linkedClass : 'Comment'
		}) )
	} ,
	insertComment : function( message , parent ) {
		var data = { message : message , parent : parent }
		
		var query = db.let( 'child', function( db ) {
			return db.insert().into( 'Comment' ).set( data )
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
	complete : function() {
		db.close()
		db = null
	}
}
