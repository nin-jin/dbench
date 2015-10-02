module.exports = {
	run : function( db , thread , result ) {
		var comments = []
		var depth = 10
		var branches = 100
		var count = branches * depth
		for( var i = 0; i < count; ++i ) {
			var comment = db.insertComment( "Hello " + thread , comments[ comments.length - 1 ] )
			comments.push( comment )
			if( comments.length > depth ) {
				comments.length = 1
			}
		}
		return [ comments[0] , comment ]
	}
}
