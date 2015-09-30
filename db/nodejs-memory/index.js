var Comment
module.exports = {
	init : function( ) {
		Comment = []
	} ,
	insertComment : function( message , parent ) {
		var data = {
			id : Comment.length ,
			message : message ,
			parent : Comment[ parent ] ,
			child : [] 
		}
		Comment.push( data )
		if( parent >= 0 ) {
			Comment[ parent ].child.push( data )
		}
		return data.id
	} ,
	selectChildMessages : function( baseId ) {
		return Comment[ baseId ].child.map( function( child ) {
			return child.message
		})
	} ,
	complete : function( ) {
		Comment = null
	}
}