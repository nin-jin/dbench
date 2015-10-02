module.exports = {
	run : function( db , thread , result ) {
		var comments = []
		var count = 1000
		var deep = 10
		for( var i = 0; i < count; ++i ) {
			var comment = db.insertComment( "Hello " + thread , comments[ comments.length - 1 ] )
			comments.push( comment )
			if( comments.length > deep ) {
				comments.length = 1
			}
		}
		return [ comments[0] , comment ]
	}
}
