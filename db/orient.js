const orientjs = require( 'orientjs' )

/** @type orientjs.ODatabaseSession */
let db

/** @type orientjs.OrientDBClient */
let client

const Try = async( cb )=> {
	try {
		return await cb()
	} catch( error ) {
		console.error( error.message )
	}
}

module.exports = {

	async init( config ) {

		client = await orientjs.OrientDBClient.connect({
			host: 'localhost',
			port: 2424,
		})

		db = await client.session({
			name: 'dbench',
			username: 'root',
			password: 'root',
		})
		
		await Try( ()=> db.command( 'drop class Comment' ).all() )
		await Try( ()=> db.command( 'drop index Comment.message' ).all() )
		
		await( db.command( 'create class Comment' ).all() )
		await( db.command( 'create property Comment.message string' ).all() )
		await( db.command( 'create property Comment.parent link Comment' ).all() )
		await( db.command( 'create property Comment.child linklist Comment' ).all() )
		await( db.command( 'create index Comment.message NOTUNIQUE' ).all() )

	},

	async insertComment( message , parent ) {
		
		var params = { message, parent }

		let batch = `
			begin;
				let $child = insert into Comment content { message: :message, parent: :parent };
				if( :parent is not null ) {
					update :parent set child = child || $child.@rid;
				}
			commit;
			return $child;
		`

		const res = await db.batch( batch, { params } ).one()
		return res['@rid']
	},
	
	async selectChildMessages( baseId ) {
		const res = await db.select( 'child.message' ).from( baseId ).one()
		return res[ 'child.message' ]
	},

	async selectDescendantMessages( baseId ) {
		const res = await db.select( 'message' ).from( db.traverse( 'child' ).from( baseId ) ).all()
		return res.map( doc => doc.message )
	},

	async selectMessagesGreater( val, limit ) {

		const res = await db.query(
			'select message from Comment where message > :val order by message limit :limit' , 
			{
				params : { val, limit }
			}
		).all()

		return res.map( doc => doc.message )

	},

	async complete() {
		await client.close()
		db = null
		client = null
	},

}
