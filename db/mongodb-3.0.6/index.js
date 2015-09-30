var sync = require( 'pms' ).$jin.async2sync

var db
var Comment
module.exports = {
	init : function( ) {
		if( db ) db.close()
		var client = require('mongodb').MongoClient
		db = sync( client.connect )
		.call( client , 'mongodb://localhost:27017/dbench' )
		Comment = db.collection( 'Comment' )
		sync( Comment.remove ).call( Comment , {} )
	} ,
	insertComment : function( message , parent ) {
		var data = { message : message , parent : parent , child : [] }
		var id = sync( Comment.insert ).call( Comment , data ).ops[0]._id
		if( parent ) {
			sync( Comment.updateOne ).call( Comment , {
				_id : parent 
			} , {
				$push : { child : id }
			}, {
				j : true,
				wtimeout : 100
			} )
		}
		return id
	} ,
	selectChildMessages : function( baseId ) {
		var ids = sync( Comment.findOne ).call( Comment , {
			_id : baseId
		} , {
			child : 1
		} ).child
		
		var query = Comment.find( {
			_id : { $in : ids }
		} , {
			message : 1
		} )
		
		var childs = sync( query.toArray ).call( query ) 
		
		var messages = childs.map( function( child ){ 
			return child.message
		})
		
		return messages
	} ,
	complete : function() {
		db.close()
		db = null
		Comment = null
	}
}
