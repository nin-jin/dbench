const { Pool } = require('pg')

const Try = async( cb )=> {
	try {
		return await cb()
	} catch( error ) {
		console.error( error.message )
	}
}

const pool = new Pool({
	user: 'postgres',
	password: 'root',
	host: 'localhost',
	database: 'dbench',
	port: 5432,
})

module.exports = {

	async init( config ) {

		await Try( ()=> pool.query( 'drop table Comment' ) )

		await pool.query( `CREATE EXTENSION IF NOT EXISTS ltree` )
		
		await pool.query(`
			create table Comment (
				id serial PRIMARY KEY,
				message text,
				parent integer references Comment,
				path ltree
			)
		`)

		await pool.query( `create index on Comment using GIST ( path )` )
		await pool.query( `create index on Comment ( parent, id )` )
		await pool.query( `create index on Comment ( message, id )` )

	},

	async insertComment( message , parent ) {

		if( parent ) {

			const res = await pool.query(
				`
					insert into Comment (message, parent, path)
					values ( $1, $2, ( select path from Comment where id = $2 ) || $2::text )
					returning id
				`,
				[ message , parent || null ]  
			)
			return res.rows[0].id

		} else {

			const res = await pool.query(
				`
					insert into Comment (message, parent, path)
					values ( $1, null, 'root' )
					returning id
				` ,
				[ message ]  
			)
			return res.rows[0].id

		}

	},

	async selectChildMessages( baseId ) {

		const res = await pool.query(
			`
				select message
				from Comment
				where parent = $1
				order by id asc
			` ,
			[ baseId ]
		)
		
		return res.rows.map( row => row.message )
	},
	
	async selectDescendantMessages( baseId ) {

		const res = await pool.query(
			`
				with Parent as (
					select
						( path || $1::text ) as path,
						message
					from Comment
					where id = $1::int
				) 
				(
					select message
					from Parent
				) union (
					select message
					from Comment
					where path <@ (
						select path
						from Parent
					)
					order by id asc
				)
			` ,
			[ baseId ]
		)
		
		return res.rows.map( row => row.message )
	},
	
	async selectMessagesGreater( val, limit ) {

		const res = await pool.query(
			`
				select message
				from Comment
				where message > $1
				order by message
				limit $2
			` ,
			[ val, limit ]
		)
		
		return res.rows.map( row => row.message )
	},

	async complete() {
		await pool.end()
	},

}
