var sync = require( 'pms' ).$jin.async2sync

var db
var query
module.exports = {
	init : function( ) {
		var pg = require('pg')
		db = sync( pg.connect )
		.call( pg , 'postgres://postgres:postgres@dbench-postgres/postgres' )
		query = sync( db.query ).bind( db )
		try {
			query( 'drop table Comment' )
		} catch( error ) {}
		query( 'create table Comment (' +
			'id serial PRIMARY KEY,' +
			'message text,' +
			'parent integer references Comment' +
		')' )
		query( 'create index on Comment (parent)' )
		query( 'create index on Comment (message)' )
	} ,
	insertComment : function( message , parent ) {
		var id = query(
			'insert into Comment (message, parent) values ( $1 , $2 ) returning id' ,
			[ message , parent || null ]  
		).rows[0].id
		return id
	} ,
	selectChildMessages : function( baseId ) {
		var messages = query(
			'select message from Comment where parent = $1' ,
			[ baseId ]
		).rows.map( function( row ){
			return row.message
		})
		return messages
	} ,
	selectMessagesGreater : function( val ) {
		var messages = query(
			'select message from Comment where message > $1 order by message limit 100' ,
			[ val ]
		).rows.map( function( row ){
			return row.message
		})
		return messages
	} ,
	complete : function() {
		db.end()
		db = null
	}
}
