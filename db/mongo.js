var db
var Comment

module.exports = {

	async init() {
		var client = require('mongodb').MongoClient
		db = await client.connect( 'mongodb://localhost:27017/dbench' )
		Comment = db.collection( 'Comment' )
		await Comment.remove({})
		Comment.createIndex({ message : 1 })
	},

	async insertComment( message , parent ) {

		var data = { message : message , parent : parent , child : [] }
		var id = await Comment.insert( data ).ops[0]._id
		
		if( parent ) {
			await Comment.updateOne( {
				_id : parent 
			} , {
				$push : { child : id }
			}, {
				j : true,
				wtimeout : 100
			} )
		}
		
		return id
	},

	async selectChildMessages( baseId ) {
		
		var ids = await Comment.findOne( {
			_id : baseId
		} , {
			child : 1
		} ).child
		
		var query = Comment.find( {
			_id : { $in : ids }
		} , {
			message : 1
		} )
		
		var childs = await query.toArray()
		
		var messages = childs.map( child => child.message )
		
		return messages
	},

	async selectMessagesGreater( val ) {
		
		var query = Comment.find( {
			message : { $gt : val }
		} , {
			message : 1
		} ).sort({ message : 1 }).limit( 100 )
		
		var docs = await query.toArray()
		
		var messages = docs.map( doc => doc.message )
		
		return messages
	},

	async complete() {
		db.close()
		db = null
		Comment = null
	},

}
