module.exports = {
	run : function( db , result ) {
		var comments = []
		var count = 10000
		var deep = 10 //Math.round( Math.sqrt( count ) )
		for( var i = 0; i < count; ++i ) {
			var comment = db.insertComment( "Hello " + i , comments[ comments.length - 1 ] )
			comments.push( comment )
			if( comments.length > deep ) {
				comments.length = 1
			}
		}
		return [ comments[0] , comment ]
	}
}
