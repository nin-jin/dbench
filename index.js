require('console.table')
require( 'pms' ).$jin.application( function( ){
	
	var dbNames = require('fs').readdirSync( './db/' )
	console.log( 'dbs : ' + dbNames.join( ' ' ) )
	var dbs = {}
	dbNames.forEach( function( name ) {
		dbs[ name ] = require( './db/' + name )
	} )
	
	var testNames = require('fs').readdirSync( './test/' )
	console.log( 'tests : ' + testNames.join( ' ' ) )
	var tests = {}
	testNames.forEach( function( name ) {
		tests[ name ] = require( './test/' + name )
	} )
	
	console.log( '\n---[ test responses ]---\n' )
	var bench = {}
	var result = {}
	for( var dbName in dbs ) {
		var db = dbs[ dbName ]
		bench[ dbName ] = { db : dbName }
		result[ dbName ] = {}
		db.init()
		
		for( var testName in tests ) {
			var start = Date.now()
			var res = tests[ testName ].run( db , result[ dbName ] )
			var time = Date.now() - start
			//console.log( dbName + ' : ' + testName + ' : ' , res )
			bench[ dbName ][ testName ] = time
			result[ dbName ][ testName ] = res
		}
		
		db.complete()
	}
	
	console.log( '\n---[ test timings ]---\n' )
	console.table( Object.keys( bench ).map( function( dbName ) {
		return bench[ dbName ]
	}) )
	
	process.exit()
} )