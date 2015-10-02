require('console.table')
var path = require( 'path' )

var sleep = require( 'pms' ).$jin.async2sync( function( delay , done ) {
	setTimeout( function() { done() } , delay * 1000 )
})

with( require( 'pms' ) ) $jin.application( function( ){
	
	var dbNames = require('fs').readdirSync( './db/' )
	console.log( 'dbs : ' + dbNames.join( ' ' ) )
	var dbs = {}
	dbNames.forEach( function( name ) {
		if( path.extname( name ) !== '.js' ) return
		dbs[ path.basename( name , '.js' ) ] = require( './db/' + name )
	} )
	
	var testNames = require('fs').readdirSync( './test/' )
	console.log( 'tests : ' + testNames.join( ' ' ) )
	var tests = {}
	testNames.forEach( function( name ) {
		if( path.extname( name ) !== '.js' ) return
		tests[ path.basename( name , '.js' ) ] = require( './test/' + name )
	} )
	
	var bench = {}
	var result = {}
	for( var dbName in dbs ) {
		var db = dbs[ dbName ]
		bench[ dbName ] = { db : dbName }
		result[ dbName ] = {}
		db.init()
		sleep( 1 )
		
		for( var testName in tests ) {
			sleep( 1 )
			
			var runAll = $jin.async2sync( function( done ) {
				var results = []
				var wait = 0
				for( var i = 0 ; i < 100 ; ++i ) {
					++wait
					runOne( db , i , result[ dbName ] , function( err , res ) {
						if( err ) done( err , res )
						results.push( res )
						if( --wait ) return
						done( null , results )
					})
				}
			} )
			
			var runOne = $jin.sync2async( tests[ testName ].run ).bind( tests[ testName ] )
			
			var start = Date.now()
			var res = runAll()
			var time = Date.now() - start
			bench[ dbName ][ testName ] = time
			result[ dbName ][ testName ] = res
			console.log( dbName , testName , time )
		}
		
		db.complete()
		
	}
	
	console.table( Object.keys( bench ).map( function( dbName ) {
		return bench[ dbName ]
	}) )
	
	process.exit()
} )