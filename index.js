require('console.table')

const config = require( './config' )
console.log( 'config ', config  )

const sleep = ()=> new Promise( done => setTimeout( done() , 1000 ) )

void ( async()=> {

	const bench = {}
	const result = {}

	for( const db_name of Object.keys( config.db ) ) {
		console.log('')

		const db = require( `./db/${db_name}.js` )
		
		bench[ db_name ] = { db : db_name }
		result[ db_name ] = {}
		
		await db.init( config.db[ db_name ] )
		
		for( const test_name of config.test ) {
			
			await sleep()

			const test = require( `./test/${test_name}.js` )
			
			const results = []
			
			let time = - Date.now()
			for( let thread = 0 ; thread < config.thread.count ; ++thread ) {
				results.push( test.run( db , thread , config, result[ db_name ] ) )
			}

			result[ db_name ][ test_name ] = await Promise.all( results )
			
			time += Date.now()
			bench[ db_name ][ test_name ] = time
			
			console.log( db_name , test_name , time )
		}
		
		await db.complete()
		
	}

	// console.log( result )
	
	console.log( '' )
	console.table( Object.keys( bench ).map( dbName => bench[ dbName ] ) )

})()